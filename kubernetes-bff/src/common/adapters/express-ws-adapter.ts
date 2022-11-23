import { HttpAdapterHost, INestApplicationContext, Logger, WsMessageHandler } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AbstractWsAdapter, MessageMappingProperties, WsException } from '@nestjs/websockets'
import { of, fromEvent, Observable } from 'rxjs'
import { filter, first, mergeMap, share, takeUntil } from 'rxjs/operators'
import * as WebSocket from 'ws'

import { CLOSE_EVENT, CONNECTION_EVENT, DISCONNECT_EVENT, ERROR_EVENT } from '@nestjs/websockets/constants'
import expressWs = require('express-ws')

enum READY_STATE {
  CONNECTING_STATE = 0,
  OPEN_STATE = 1,
  CLOSING_STATE = 2,
  CLOSED_STATE = 3
}
export type ExpressWsSocket = WebSocket & {
  params: {
    [key: string]: string
  }
}
export class ExpressWsAdapter extends AbstractWsAdapter {
  protected readonly logger = new Logger(ExpressWsAdapter.name)
  protected expressAdapter: ExpressAdapter
  protected underlyingServer: {
    app: any
    instance: WebSocket.Server
  } = null

  protected path: string

  constructor(appOrHttpServer?: INestApplicationContext | any) {
    super(appOrHttpServer)
    const httpAdapterHost: HttpAdapterHost = appOrHttpServer.get('HttpAdapterHost')
    this.expressAdapter = httpAdapterHost.httpAdapter
  }

  public create(port: number, options?: any & { server?: any }): any {
    let app
    let instance

    const { path = '/' } = options
    delete options.path
    const { httpServer } = this

    if (this.underlyingServer !== null) {
      ;({ app, instance } = this.underlyingServer)
    } else {
      app = this.expressAdapter.getInstance()
      instance = expressWs(app, httpServer, {
        wsOptions: { clientTracking: true, ...options }
      })

      this.underlyingServer = {
        app,
        instance
      }
    }
    this.path = path
    const ws = instance.getWss()
    return this.bindErrorHandler(ws)
  }

  public bindErrorHandler(server: any): any {
    server.on(CONNECTION_EVENT, (ws: WebSocket) => ws.on(ERROR_EVENT, (err: any) => this.logger.error(`123${err}`)))
    server.on(ERROR_EVENT, (err: any) => this.logger.error(err))
    return server
  }

  public bindClientConnect(server: WebSocket.Server, callback: (...args: any) => any): void {
    const { app, instance } = this.underlyingServer
    if (this.path) {
      app.ws(this.path, (ws, request) => {
        ws.params = request.params
        callback(ws, request)
      })
    }
  }

  public bindClientDisconnect(client: WebSocket, callback: (this: WebSocket, args: any[]) => void): void {
    client.on(DISCONNECT_EVENT, callback)
  }

  public bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>
  ): void {
    const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), first())
    const source$ = fromEvent(client, 'message').pipe(
      // tap(console.log.bind(console)),
      mergeMap((data) => this.bindMessageHandler(data, handlers, transform).pipe(filter((result) => result != null))),
      takeUntil(close$)
    )
    const onMessage = (response: any): void => {
      if (client.readyState !== READY_STATE.OPEN_STATE) {
        return
      }
      client.send(JSON.stringify(response))
    }
    source$.subscribe(onMessage)
  }

  bindMessageHandler(
    buffer: any,
    handlers: WsMessageHandler<string>[],
    transform: (data: any) => Observable<any>
  ): Observable<any> {
    try {
      const rawMessage: string = buffer.data
      let message = null
      try {
        message = JSON.parse(rawMessage)
      } catch {
        message = {
          types: 'input',
          input: rawMessage
        }
      }
      const messageHandler = handlers.find((handler) => handler.message === message.types)
      if (!messageHandler) {
        throw new WsException('message.types is not implemented')
      }
      const { callback } = messageHandler
      return transform(callback(message))
    } catch (error) {
      this.logger.warn(error)
      return of()
    }
  }
}

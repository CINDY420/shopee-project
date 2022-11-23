import { HttpAdapterHost, INestApplicationContext, Logger, WsMessageHandler } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AbstractWsAdapter, MessageMappingProperties, WsException } from '@nestjs/websockets'
import { CLOSE_EVENT, CONNECTION_EVENT, DISCONNECT_EVENT, ERROR_EVENT } from '@nestjs/websockets/constants'
import * as express from 'express'
import { Server as HttpServer } from 'http'
import { Server as HttpsServer } from 'https'
import { empty, fromEvent, Observable } from 'rxjs'
import { filter, first, mergeMap, share, takeUntil } from 'rxjs/operators'
import * as WebSocket from 'ws'

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

export interface ExpressWsGatewayApplications {
  app: expressWs.Application
  instance: expressWs.Instance
}

export class ExpressWsAdapter2 extends AbstractWsAdapter {
  protected readonly logger = new Logger(ExpressWsAdapter2.name)
  protected appByPorts: Map<number, ExpressWsGatewayApplications>
  protected connectCallback!: (...args: any) => any
  protected expressAdapter!: ExpressAdapter
  protected servers: Array<HttpServer | HttpsServer>

  constructor(appOrHttpServer?: INestApplicationContext) {
    super(appOrHttpServer)
    this.appByPorts = new Map()
    const httpAdapterHost: HttpAdapterHost = appOrHttpServer.get('HttpAdapterHost')
    this.expressAdapter = httpAdapterHost.httpAdapter
    this.servers = []
  }

  public create(port: number, options?: any & { server?: any }): any {
    let app
    let instance

    const { path = '/' } = options
    delete options.path

    const { httpServer } = this
    const apps = this.appByPorts.get(port)
    if (apps != null) {
      ;({ app, instance } = apps)
    } else {
      if (port === 0 && httpServer) {
        app = this.expressAdapter.getInstance()
        instance = expressWs(app, httpServer, {
          wsOptions: { clientTracking: true, ...options }
        })
      } else {
        app = (express() as any) as expressWs.Application
        instance = expressWs(app, undefined, {
          wsOptions: { clientTracking: true, ...options }
        })
        this.servers.push(app.listen(port))
      }
      this.appByPorts.set(port, { app, instance })
    }

    app.ws(path, (websocket: WebSocket, request: express.Request) => {
      if (this.connectCallback != null) {
        ;(websocket as ExpressWsSocket).params = request.params
        this.connectCallback(websocket, request)
      } else {
        this.logger.warn('No connection handler set.')
      }
    })

    const wss = instance.getWss()
    return this.bindErrorHandler(wss)
  }

  public bindClientConnect(server: WebSocket.Server, callback: (args: any) => any): void {
    this.connectCallback = callback
  }

  public bindClientDisconnect(client: WebSocket, callback: (this: WebSocket, args: any[]) => void): void {
    client.on(DISCONNECT_EVENT, callback)
  }

  public bindErrorHandler(server: any): any {
    server.on(CONNECTION_EVENT, (ws: WebSocket) => ws.on(ERROR_EVENT, (err: any) => this.logger.error(err)))
    server.on(ERROR_EVENT, (err: any) => this.logger.error(err))
    return server
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
      if (messageHandler == null) {
        return
      }
      const { callback } = messageHandler
      return transform(callback(message))
    } catch (error) {
      this.logger.warn(error)
    }
  }

  close(server: any): void {
    super.close(server)
    if (this.httpServer != null) {
      this.httpServer.close()
    }
    this.servers
      .filter((otherServer: any) => {
        return otherServer != null && typeof otherServer.close === 'function'
      })
      .forEach((otherServer: any) => {
        otherServer.close()
      })
  }
}

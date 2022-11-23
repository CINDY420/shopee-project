import { UseFilters } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets'
import * as WebSocket from 'ws'
import { ESService } from 'common/modules/es/es.service'
import { PodsService } from 'applications-management/pods/pods.service'
import * as k8s from '@kubernetes/client-node'
import { Readable, Writable } from 'stream'
import {
  POD_TERMINAL_WEBSOCKET_URL,
  TYPES,
  WEBSOCKET_AUTH_ERROR,
  WEBSOCKET_HTTP_NOT_FOUND,
  WEBSOCKET_K8S_SRV_ERROR,
  WEBSOCKET_SUCCESS
} from 'applications-management/pods/pods.constant'
import { ConfigService } from '@nestjs/config'
import { IGlobalConfig } from 'common/interfaces'
import { JWT_COOKIE_KEY } from 'common/constants/sessions'
import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import * as moment from 'moment'
import { TERMINAL_LOG_MAPPING } from 'common/constants/esMapping'
import { READY_STATE, VIRTUAL_PORT } from 'common/constants/websocket'
import { k8sExecContext, WsClient, socketMessage } from 'applications-management/pods/pods.interface'
import { GatewayExceptionFilter } from 'common/errors/gateway.exception'
import { TICKET_STATUS } from 'common/constants/ticket'
import { AuthService } from 'common/modules/auth/auth.service'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { TerminalAuditService } from 'applications-management/pods/terminal.audit.service'
import { Logger } from 'common/helpers/logger'

const formatNumber = (n) => (n < 10 ? '0' + n : n)

@WebSocketGateway(VIRTUAL_PORT.POD_TERMINAL, {
  cookie: true,
  path: POD_TERMINAL_WEBSOCKET_URL
})
@UseFilters(new GatewayExceptionFilter())
export class PodsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(PodsGateway.name)

  constructor(
    private esService: ESService,
    private podsService: PodsService,
    private configService: ConfigService,
    private authService: AuthService,
    private terminalAuditService: TerminalAuditService
  ) {}

  async handleConnection(client: WsClient, ctx) {
    this.logger.log('ws connection!')

    const { params, query, cookies = {} } = ctx
    let token
    let authUser: IAuthUser

    try {
      const readableStream = new Readable()
      readableStream._read = () => {
        // todo
      }
      const writableStream = new Writable()
      writableStream._write = () => {
        // todo
      }

      client.k8sExecContext = {
        ws: null, // ws to k8s exec will be create when login succeed
        stdin: readableStream,
        stdout: writableStream,
        params,
        query,
        log: ''
      }

      client.terminalAudit = {
        connectTime: null,
        filePath: '',
        writeStream: null,
        uid: '',
        gapTimestamp: 0,
        isFileTransfering: false
      }

      token = cookies[JWT_COOKIE_KEY]
      const jwtSession = await this.authService.verifyToken(token)
      const { ID } = jwtSession
      const userRoles = await this.authService.getUserRoles(ID, token)
      const { roles } = userRoles

      authUser = { ...jwtSession, roles }

      client.k8sExecContext = {
        ...client.k8sExecContext,
        authToken: token,
        authUser
      }
    } catch (e) {
      this.logger.error(`Terminal ws connection failed: ${e}`)
    }
  }

  @SubscribeMessage('login')
  async handleLogin(client: WsClient, data: any) {
    const { k8sExecContext } = client
    const { params, query, stdin, stdout, authUser, authToken } = k8sExecContext
    const { tenantId, projectName, appName, podName, containerName } = params
    const { clusterId } = query

    let socket = null
    try {
      this.terminalAuditService.createRecordsFile(client)
      const { token, namespace, pod } = await this.podsService.checkBeforeExecCMDinPodContainer({
        projectName,
        appName,
        podName,
        containerName,
        clusterId
      })

      client.k8sExecContext.pod = pod

      // live env
      const { metadata } = pod
      const { labels, annotations } = metadata
      const env = this.getEnvFromAnnotationOrLabel(annotations, labels)
      const globalConfig = this.configService.get<IGlobalConfig>('global')
      const { livePodExec } = globalConfig
      const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)

      const canLoginLive = RBACCheckTenantResourceAction(
        tenantPermissions,
        Number(tenantId),
        RESOURCE_TYPE.POD_TERMINAL,
        RESOURCE_ACTION.ViewLive
      )
      const canLoginNonLive = RBACCheckTenantResourceAction(
        tenantPermissions,
        Number(tenantId),
        RESOURCE_TYPE.POD_TERMINAL,
        RESOURCE_ACTION.ViewNonLive
      )

      const canLogin = livePodExec && env.toLowerCase() === 'live' ? canLoginLive : canLoginNonLive

      if (!canLogin) {
        const { authPass, updateTime } = await this.getTerminalTicket(client, tenantId, projectName, authUser.ID)
        client.k8sExecContext.updateTime = updateTime
        if (!authPass) {
          // disconnect
          const message = {
            types: TYPES.MESSAGE_TYPE,
            ret: WEBSOCKET_AUTH_ERROR,
            msg: 'user aceess auth not passed'
          }

          return this.disconnect(client, socket, message)
        } else {
          const isExpired = this.checkIsExpired(client)
          if (isExpired) {
            const message = {
              types: TYPES.MESSAGE_TYPE,
              ret: WEBSOCKET_AUTH_ERROR,
              msg: 'web terminal auth out of time'
            }
            return this.disconnect(client, socket, message)
          }
        }
      }

      const kc = new k8s.KubeConfig()
      kc.loadFromString(token)
      const exec = new k8s.Exec(kc)
      const command = ['timeout', '3600', 'bash']
      socket = await exec.exec(namespace, podName, containerName, command, stdout, null, stdin, true)
      client.k8sExecContext.ws = socket

      // handle resize
      this.handleResize(client, data)

      socket.onclose = () => {
        if (client.readyState === READY_STATE.OPEN_STATE) {
          this.terminalAuditService.uploadRecordsFile(k8sExecContext, client)
          client.close()
        }
      }

      socket.onerror = (event: WebSocket.ErrorEvent) => {
        if (client.readyState === READY_STATE.OPEN_STATE) {
          const message = {
            types: TYPES.MESSAGE_TYPE,
            ret: WEBSOCKET_K8S_SRV_ERROR,
            msg: JSON.stringify(event)
          }
          client.send(JSON.stringify(message))
        }
      }

      client.onclose = () => {
        if (socket.readyState === READY_STATE.OPEN_STATE) {
          this.terminalAuditService.uploadRecordsFile(k8sExecContext, client)
          socket.close()
        }
      }

      socket.onmessage = (event: WebSocket.MessageEvent) => {
        if (client.readyState === READY_STATE.OPEN_STATE) {
          const data = event.data
          if (data instanceof Buffer) {
            const rawData = data.slice(1)
            this.terminalAuditService.appendRecord(rawData, client)
            client.send(rawData)
          } else {
            this.terminalAuditService.appendRecord(data, client)
            client.send(data)
          }
        }
      }
    } catch (e) {
      const message = {
        types: TYPES.MESSAGE_TYPE,
        ret: WEBSOCKET_HTTP_NOT_FOUND,
        msg: e
      }

      return this.disconnect(client, socket, message)
    }

    client.k8sExecContext.isLogin = true

    return {
      ret: WEBSOCKET_SUCCESS,
      msg: 'login Sucess',
      type: TYPES.MESSAGE_TYPE
    }
  }

  @SubscribeMessage('input')
  async handleMessage(client: WsClient, data: { input: string }) {
    const { input } = data
    const { k8sExecContext } = client
    const { stdin } = k8sExecContext

    stdin.push(input)

    if (input.charCodeAt && input.charCodeAt(0) === 127 && k8sExecContext.log.length > 0) {
      // backspace key
      const log = k8sExecContext.log
      k8sExecContext.log = log.slice(0, log.length - 1)
    } else if (input.charCodeAt && input.charCodeAt(0) !== 27) {
      // when input is not direction key, log the input
      k8sExecContext.log += input
    }
    if (k8sExecContext.log.endsWith('\r')) {
      const command = k8sExecContext.log
      const commands = command.split('\r').filter((i) => i)
      if (commands.length < 10) {
        await Promise.all(
          commands.map((command) => {
            return this.handleUserTerminalLog(command, k8sExecContext, client)
          })
        )
      } else {
        await this.handleUserTerminalLog(command, k8sExecContext, client)
      }

      client.k8sExecContext.log = ''
    }
  }

  @SubscribeMessage('resize')
  handleResize(client: WsClient, data: any) {
    const { rows, cols } = data
    const { k8sExecContext } = client
    if (!k8sExecContext) {
      return null
    }
    const { stdout } = k8sExecContext
    if (stdout) {
      stdout.rows = rows
      stdout.columns = cols
    }

    return null
  }

  @SubscribeMessage('heartbeat')
  handleHeartBeat(client: WsClient) {
    const { k8sExecContext } = client
    const { ws, isLogin } = k8sExecContext
    if (!isLogin) {
      return null
    }
    const isExpired = this.checkIsExpired(client)

    if (isExpired) {
      const message = {
        types: TYPES.MESSAGE_TYPE,
        ret: WEBSOCKET_AUTH_ERROR,
        msg: 'web terminal auth out of time'
      }
      return this.disconnect(client, ws, message, true)
    }
    return null
  }

  private async handleUserTerminalLog(command: string, ctx: k8sExecContext, client: WsClient) {
    const { authUser, params, pod, query } = ctx
    const { Email } = authUser
    const { clusterId } = query
    const { tenantId, projectName, appName, podName, containerName } = params
    const { spec, status } = pod
    const { nodeName } = spec
    const { podIP, hostIP } = status
    if (!pod || !authUser) {
      this.logger.error('Error: pod or auth user information should provided')
      return
    }

    const now = new Date(Date.now())
    const esIndex = `${ESIndex.TERMINAL_LOG}-${now.getFullYear()}-${formatNumber(now.getMonth() + 1)}-${formatNumber(
      now.getDate()
    )}`

    await this.esService
      .initIndex(esIndex as ESIndex, TERMINAL_LOG_MAPPING)
      .then(() => {
        const requestPath = `/api/v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/containers/${containerName}/terminal`
        const logData = {
          email: Email,
          name: Email,
          department: tenantId,
          requestPath,
          nodeName,
          pod: podName,
          nodeIP: hostIP,
          podIP,
          container: containerName,
          requestMethod: 'GET',
          requestQuery: `clusterId=${clusterId}`,
          requestCmd: command,
          '@timestamp': now.toISOString(),
          group: tenantId,
          project: projectName,
          application: appName,
          sessionId: client.terminalAudit.uid
        }

        this.esService.index(esIndex as ESIndex, logData)
      })
      .catch((e) => {
        this.logger.error(`Failed to log terminal for ${e}`)
      })
  }

  private checkIsExpired(client: WsClient, time?: string) {
    const { k8sExecContext } = client
    const { updateTime } = k8sExecContext

    const realTime = time || updateTime

    if (realTime) {
      const expired = 14400 // mill second, 4 hours expired
      const startDate = moment.utc(realTime)
      const endDate = moment.utc()

      const duration = moment.duration(endDate.diff(startDate)).asSeconds()
      return duration > expired
    }

    return false
  }

  private getEnvFromAnnotationOrLabel(annotations, labels): string {
    return labels.env || annotations['kube-platform.shopee.io/env'] || 'unknown'
  }

  private disconnect(client: WsClient, socket: WebSocket, message: socketMessage, upload = false) {
    if (client.readyState === READY_STATE.OPEN_STATE) {
      client.send(JSON.stringify(message))
    }

    // disconnect after client receive close message
    setTimeout(() => {
      // client.close()
      if (socket && socket.readyState === READY_STATE.OPEN_STATE) {
        socket.close()
      } else if (client.readyState === READY_STATE.OPEN_STATE) {
        client.close()
      }
      if (upload) {
        const { k8sExecContext } = client
        this.terminalAuditService.uploadRecordsFile(k8sExecContext, client)
      } else {
        this.terminalAuditService.deleteRecordsFile(client)
      }
    }, 100)
  }

  private async getTerminalTicket(
    client: WsClient,
    tenantId,
    projectName,
    applicant
  ): Promise<{ authPass: boolean; updateTime: string | undefined }> {
    const { documents }: any = await this.esService.booleanQueryAll(
      ESIndex.TICKET,
      {
        must: [
          {
            term: { tenant: tenantId }
          },
          {
            term: { applicant }
          },
          {
            term: { project: projectName }
          },
          {
            term: { status: TICKET_STATUS.APPROVED }
          }
        ]
      },
      ES_MAX_SEARCH_COUNT
    )

    const document = documents.find((document) => {
      const { updatedAt } = document
      const isExpired = this.checkIsExpired(client, updatedAt)
      return !isExpired
    })

    const authPass = !!document

    return {
      authPass,
      updateTime: authPass ? document.updatedAt : undefined
    }
  }
}

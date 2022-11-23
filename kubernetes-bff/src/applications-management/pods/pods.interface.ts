import { ExpressWsSocket } from 'common/adapters/express-ws-adapter'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { IPodItem } from 'applications-management/deployments/dto/deployment.dto'
import { Readable, Writable } from 'stream'
import { WriteStream } from 'fs'
import * as WebSocket from 'ws'

export interface k8sExecContext {
  ws: WebSocket | null
  stdin?: Readable
  stdout: Writable & { columns?: number; rows?: number }
  params: {
    tenantId: string
    projectName: string
    appName: string
    podName: string
    containerName: string
  }
  query: {
    clusterId: string
  }
  authToken?: string
  authUser?: IAuthUser
  rbacUser?: any
  updateTime?: string
  pod?: IPodItem
  log?: string
  isLogin?: boolean
}

export interface terminalAudit {
  connectTime: Date | null
  filePath: string
  writeStream: WriteStream | null
  uid: string
  gapTimestamp: number
  isFileTransfering: boolean
}

export type WsClient = ExpressWsSocket & { k8sExecContext: k8sExecContext } & {
  terminalAudit: terminalAudit
  terminalAuditEnable: boolean
}

export interface socketMessage {
  types: number
  ret: number
  msg: string
}

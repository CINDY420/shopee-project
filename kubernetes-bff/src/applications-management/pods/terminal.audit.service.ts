import { Injectable } from '@nestjs/common'
import { unlink, createWriteStream, mkdir, access } from 'fs'
import { StringDecoder } from 'string_decoder'
import * as moment from 'moment'
import * as uuid from 'uuid'
import * as WebSocket from 'ws'

import { k8sExecContext, WsClient } from 'applications-management/pods/pods.interface'
import { ESService } from 'common/modules/es/es.service'
import { UssService } from 'common/modules/uss/uss.service'
import { ESIndex } from 'common/constants/es'
import { TERMINAL_REPLAY_MAPPING } from 'common/constants/esMapping'
import { ConfigService } from '@nestjs/config'
import { IGlobalConfig } from 'common/interfaces'
import {
  UPLOAD_FLAG_UNIT8ARRAY,
  DOWNLOAD_FLAG_UNIT8ARRAY,
  COMPLETE_UPLOAD_FLAG_UNIT8ARRAY,
  COMPLETE_DOWNLOAD_FLAG_UNIT8ARRAY
} from 'applications-management/pods/terminal.audit.constant'
import { Logger } from 'common/helpers/logger'

const FOLDER_PATH = process.cwd() + '/temp'

@Injectable()
export class TerminalAuditService {
  private readonly logger = new Logger(TerminalAuditService.name)

  constructor(private esService: ESService, private ussService: UssService, private configService: ConfigService) {}

  private checkIsEnable(): boolean {
    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { terminalAudit = false } = globalConfig
    return terminalAudit
  }

  createRecordsFile(client: WsClient) {
    const isEnable = this.checkIsEnable()
    client.terminalAuditEnable = isEnable
    if (!isEnable) {
      return
    }
    client.terminalAudit.uid = uuid.v4()
    access(FOLDER_PATH, (error) => {
      if (error) {
        mkdir(FOLDER_PATH, (error) => {
          if (error) this.logger.error(`mkdir failed: ${error}`)
          this.appendHeader(client)
        })
      } else {
        this.appendHeader(client)
      }
    })
  }

  appendHeader(client: WsClient) {
    if (!client.terminalAuditEnable) {
      return
    }
    client.terminalAudit.connectTime = new Date()
    client.terminalAudit.filePath = `${FOLDER_PATH}/${client.terminalAudit.uid}.cast`
    const startTimestamp = Math.floor(client.terminalAudit.connectTime.valueOf() / 1000)
    const header = {
      version: 2,
      width: 200,
      height: 30,
      timestamp: startTimestamp,
      env: { SHELL: '/bin/bash', TERM: 'xterm-256color' }
    }
    client.terminalAudit.writeStream = createWriteStream(client.terminalAudit.filePath, {
      encoding: 'utf8',
      flags: 'a'
    })
    client.terminalAudit.writeStream.write(JSON.stringify(header) + '\r\n')
  }

  appendRecord(data: WebSocket.Data, client: WsClient) {
    if (!client.terminalAuditEnable) {
      return
    }
    const downloadingFlag = Buffer.from(DOWNLOAD_FLAG_UNIT8ARRAY)
    const uploadingFlag = Buffer.from(UPLOAD_FLAG_UNIT8ARRAY)
    const completeDownload = Buffer.from(COMPLETE_DOWNLOAD_FLAG_UNIT8ARRAY)
    const completeUpload = Buffer.from(COMPLETE_UPLOAD_FLAG_UNIT8ARRAY)

    const currentTimestamp = Date.now() / 1000
    client.terminalAudit.gapTimestamp = currentTimestamp - client.terminalAudit.connectTime.getTime() / 1000

    let recordData
    if (data instanceof Buffer) {
      if (data.equals(downloadingFlag) || data.equals(uploadingFlag)) {
        client.terminalAudit.isFileTransfering = true
        recordData = 'File is downloading/uploading...\r\n'
        this.writeDataToFile(recordData, client)
      } else if (data.equals(completeDownload) || data.equals(completeUpload)) {
        client.terminalAudit.isFileTransfering = false
        recordData = 'File complete download/upload.\r\n'
      } else {
        const decoder = new StringDecoder('utf8')
        recordData = decoder.write(data)
        decoder.end()
      }
    } else {
      recordData = data
    }

    if (!client.terminalAudit.isFileTransfering) {
      this.writeDataToFile(recordData, client)
    }
  }

  writeDataToFile(data: string, client: WsClient) {
    // asciinema player v2 data format, 'o' means data written to stdout
    const inputData = [client.terminalAudit.gapTimestamp, 'o', data]
    client.terminalAudit.writeStream.write(JSON.stringify(inputData) + '\r\n')
  }

  deleteRecordsFile(client: WsClient) {
    if (!client.terminalAuditEnable) {
      return
    }
    unlink(client.terminalAudit.filePath, (error) => {
      error && this.logger.error(`delete file failed: ${error}`)
    })
    client.terminalAudit.writeStream.end()
  }

  async writeTerminalReplayConfigInES(context: k8sExecContext, fileId: string, client: WsClient) {
    if (!client.terminalAuditEnable) {
      return
    }
    const { params, authUser, pod } = context
    const { appName: application, containerName: container, tenantId: tenant, projectName: project, podName } = params
    const { spec, status } = pod
    const { nodeName } = spec
    const { podIP, hostIP } = status
    const { Email: email } = authUser

    const time = moment.duration(Math.ceil(client.terminalAudit.gapTimestamp), 'seconds')
    const duration = moment({ h: time.hours(), m: time.minutes(), s: time.seconds() }).format('HH:mm:ss')

    const esIndex = `${ESIndex.TERMINAL_REPLAY}-${moment.utc(new Date()).format('YYYY-MM-DD')}`

    await this.esService
      .initIndex(esIndex, TERMINAL_REPLAY_MAPPING)
      .then(() => {
        const terminalReplayConfig = {
          fileId,
          application,
          container,
          email,
          tenant,
          project,
          nodeName,
          podName,
          podIP,
          duration,
          nodeIP: hostIP,
          name: email,
          sessionId: client.terminalAudit.uid,
          '@timestamp': client.terminalAudit.connectTime
        }

        this.esService.index(esIndex, terminalReplayConfig)
      })
      .catch((e) => {
        this.logger.error(`Failed to update replay terminal for ${e.message}, ${e.stack}`)
      })
  }

  async uploadRecordsFile(context: k8sExecContext, client: WsClient) {
    if (!client.terminalAuditEnable) {
      return
    }
    const fileId = await this.ussService.uploadFile(
      client.terminalAudit.filePath,
      client.terminalAudit.uid,
      client.terminalAudit.connectTime,
      context.authUser.Email,
      context.params.podName
    )
    fileId && this.writeTerminalReplayConfigInES(context, fileId, client)
    this.deleteRecordsFile(client)
  }
}

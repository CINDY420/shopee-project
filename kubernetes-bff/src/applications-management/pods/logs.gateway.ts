import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { PodsService } from './pods.service'
import * as k8s from '@kubernetes/client-node'
import { LineStream } from 'byline'
import { UseFilters } from '@nestjs/common'
import { READY_STATE, VIRTUAL_PORT } from 'common/constants/websocket'
import { WsClient } from './pods.interface'
import {
  EPHEMERAL_CONTAINER_NAME,
  EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME,
  EPHEMERAL_CONTAINER_VOLUME_MOUNT_PATH,
  POD_LOGS_WEBSOCKET_URL,
  TYPES,
  WEBSOCKET_K8S_SRV_ERROR,
  WEBSOCKET_SUCCESS
} from './pods.constant'
import { fromEvent } from 'rxjs'
import { first, share, takeUntil, throttleTime } from 'rxjs/operators'
import { CLOSE_EVENT } from '@nestjs/websockets/constants'
import { IPodItem } from 'applications-management/deployments/dto/deployment.dto'
import { ClientManagerService } from 'common/modules/client-manager/client-manager.service'
import { parseClusterIdWithFte } from 'common/helpers/cluster'
import { ESService } from 'common/modules/es/es.service'
import { ESIndex } from 'common/constants/es'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { GatewayExceptionFilter } from 'common/errors/gateway.exception'
import { Logger } from 'common/helpers/logger'

// every gateway have a virtual port represent a unique id but the real ws server in running on same port of nest http server
@WebSocketGateway(VIRTUAL_PORT.POD_LOG, {
  path: POD_LOGS_WEBSOCKET_URL
})
@UseFilters(new GatewayExceptionFilter())
export class LogsGateway implements OnGatewayConnection {
  protected readonly logger = new Logger(LogsGateway.name)

  constructor(
    private podsService: PodsService,
    private clientManagerService: ClientManagerService,
    private esService: ESService,
    private clusterService: ClustersService,
    private agentService: AgentService
  ) {}

  async handleConnection(client: WsClient, ctx) {
    const { params, query } = ctx

    const logStream = new LineStream()

    client.k8sExecContext = {
      ws: null, // ws to k8s exec will be create when login succeed
      stdout: logStream,
      params,
      query
    }
  }

  @SubscribeMessage('login')
  async handleLogin(client: WsClient, data: any) {
    const { rows, cols } = data || {}

    const { k8sExecContext } = client
    const { params, query, stdout } = k8sExecContext
    const { projectName, appName, podName, containerName } = params
    const { clusterId } = query

    if (rows && cols) {
      stdout.rows = rows
      stdout.columns = cols
    }

    const commonErrorMessage = `log ${podName} ${containerName} error`

    const { clusterName } = parseClusterIdWithFte(clusterId)

    let logContainerName = containerName
    let namespace = ''

    try {
      const cluster = await this.esService.getById(ESIndex.CLUSTER, clusterName)

      if (!cluster) {
        // disconnect handle
        const message = `${commonErrorMessage}: cluster ${clusterName} not exist!`
        this.logger.error(message)
        const data = {
          types: TYPES.MESSAGE_TYPE,
          ret: WEBSOCKET_K8S_SRV_ERROR,
          msg: JSON.stringify(message)
        }
        return this.disconnect(client, data)
      }

      const { config: token } = await this.clusterService.findByName(clusterName)
      const labelsSelect = {
        project: projectName,
        application: appName
      }
      const pod = await this.agentService.request<IPodItem>(
        'poddetailv2',
        true,
        { config: token, clusterName },
        {
          podname: podName,
          labelsSelect: JSON.stringify(labelsSelect)
        }
      )
      const { metadata, spec } = pod
      const { ephemeralContainers = [] } = spec || {}

      namespace = metadata?.namespace

      const containerStatuses = pod?.status?.containerStatuses || []
      const containerStatus = containerStatuses.find((containerStatus) => containerStatus?.name === containerName)
      const isContainerRunning = !!containerStatus?.state?.running
      const containerIdSubPaths = (containerStatus?.containerID || '').split('/')
      const containerId = (containerIdSubPaths.length > 0 && containerIdSubPaths[containerIdSubPaths.length - 1]) || ''

      if (!isContainerRunning && containerId !== '') {
        // create a container for logs
        this.logger.log(`${commonErrorMessage}: container not ready`)
        const isDockerPathExist = this.checkIsDebugDockerPathExist(pod)

        if (!isDockerPathExist) {
          const message = `${commonErrorMessage}: docker path is not exist!`
          this.logger.error(message)
          const data = {
            types: TYPES.MESSAGE_TYPE,
            ret: WEBSOCKET_K8S_SRV_ERROR,
            msg: JSON.stringify(message)
          }
          return this.disconnect(client, data)
        }

        // try to use EphemeralContainers
        const ephemeralContainer = ephemeralContainers.find(
          (ephemeralContainer) => ephemeralContainer.name === EPHEMERAL_CONTAINER_NAME
        )
        if (ephemeralContainer) {
          // use this container
          logContainerName = EPHEMERAL_CONTAINER_NAME
        }
        // try to create EphemeralContainers
        const ec = { objectMeta: {} } as any
        ec.objectMeta.name = metadata.name
        ec.objectMeta.namespace = metadata.namespace
        ec.ephemeralContainers = ephemeralContainers

        ec.ephemeralContainers.push({
          ephemeralContainerCommon: {
            command: ['bash'],
            name: EPHEMERAL_CONTAINER_NAME,
            image: process.env.DEBUGGER_IMAGE || 'busybox',
            imagePullPolicy: 'IfNotPresent',
            terminationMessagePolicy: 'File',
            volumeMounts: [
              {
                name: EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME,
                mountPath: EPHEMERAL_CONTAINER_VOLUME_MOUNT_PATH,
                readOnly: true
              }
            ],
            stdin: true,
            TTY: true
          },
          targetContainerName: containerName
        })

        const k8sClient = this.clientManagerService.getClient(token)

        const coreK8sApi = k8sClient.makeApiClient(k8s.CoreV1Api)
        await coreK8sApi.patchNamespacedPod(metadata.name, metadata.namespace, ec)
        logContainerName = EPHEMERAL_CONTAINER_NAME
      }

      const kc = new k8s.KubeConfig()
      kc.loadFromString(token)
      const log = new k8s.Log(kc)

      const request = await log.log(
        namespace,
        podName,
        logContainerName,
        stdout,
        (err) => {
          this.logger.error(`Container log error: ${err}`)
        },
        {
          follow: true,
          tailLines: 100
        }
      )
      const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), first())
      const source$ = fromEvent(stdout, 'data').pipe(throttleTime(1000), takeUntil(close$))
      source$.subscribe((data) => {
        if (client.readyState === READY_STATE.OPEN_STATE) {
          client.send(data.toString())
        }
      })
      close$.subscribe(() => {
        request.end()
        request.response?.emit('end')
        stdout.end()
      })
    } catch (e) {
      const message = `${commonErrorMessage}: ${e}`
      this.logger.error(message)
      const data = {
        types: TYPES.MESSAGE_TYPE,
        ret: WEBSOCKET_K8S_SRV_ERROR,
        msg: JSON.stringify(message)
      }
      return this.disconnect(client, data)
    }

    return {
      ret: WEBSOCKET_SUCCESS,
      msg: 'login Sucess',
      type: TYPES.MESSAGE_TYPE
    }
  }

  @SubscribeMessage('heartbeat')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleHeartBeat(client: WsClient) {
    // do nothings
    return null
  }

  @SubscribeMessage('resize')
  handleResize(client: WsClient, data: any) {
    const { rows, cols } = data || {}
    const { k8sExecContext } = client
    const { stdout } = k8sExecContext
    if (rows && cols) {
      stdout.rows = rows
      stdout.columns = cols
    }

    return null
  }

  private checkIsDebugDockerPathExist(pod: IPodItem): boolean {
    const { spec } = pod
    const { volumes } = spec
    const isDebugDockerPathExist = volumes.find(
      (volume) => !!volume.hostPath && volume.name === EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME
    )
    return !!isDebugDockerPathExist
  }

  private disconnect(client: WsClient, message: any) {
    if (client.readyState === READY_STATE.OPEN_STATE) {
      client.send(JSON.stringify(message))

      // disconnect after client receive close message
      setTimeout(() => {
        if (client.readyState === READY_STATE.OPEN_STATE) {
          client.close()
        }
      }, 100)
    }
  }
}

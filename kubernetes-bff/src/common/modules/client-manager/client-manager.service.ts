import { Injectable } from '@nestjs/common'
import * as k8s from '@kubernetes/client-node'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class ClientManagerService {
  private logger: Logger

  public clientMap: { [token: string]: k8s.KubeConfig } = {}

  constructor() {
    this.logger = new Logger(ClientManagerService.name)
  }

  public getClient(token: string): k8s.KubeConfig {
    const client = this.clientMap[token]

    if (client) {
      return client
    } else {
      return this.generateClient(token)
    }
  }

  private generateClient(token: string): k8s.KubeConfig {
    try {
      const client = new k8s.KubeConfig()
      client.loadFromString(token)

      this.clientMap[token] = client

      return client
    } catch (e) {
      this.logger.error(`generate k8s client failed: ${e}`)
      throw new Error(e)
    }
  }
}

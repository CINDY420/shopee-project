import { Injectable } from '@nestjs/common'
import APM from 'elastic-apm-node'

@Injectable()
export class ApmService {
  apm: APM.Agent

  constructor() {
    this.apm = APM
  }

  captureError(data: any) {
    this.apm.captureError(data)
  }

  startTransaction(name: string, type: string): any {
    return this.apm.startTransaction(name, type)
  }

  setTransactionName(name: string) {
    return this.apm.setTransactionName(name)
  }

  startSpan(name: string) {
    return this.apm.startSpan(name)
  }

  setCustomContext(context: object) {
    return this.apm.setCustomContext(context)
  }

  /*
   * setTag(name: string, value) {
   *   return this.apm.setTag(name, value)
   * }
   */
}

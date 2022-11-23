import * as axios from 'axios'
export interface IUssConfig {
  protocol: string
  host: string
  port?: number
  regionId: string
  appId: string
  appSecret: string
  bucketName: string
}

export interface IUssRequestArgs {
  server: string
  resourceURI: string
  version: string
  params: any
  headers: any
  token: string
  payload: any
  method: axios.Method
  index: number
  uid: string
  connectionTime: Date
  email: string
  podName: string
  responseType: axios.ResponseType
  retryTimes: number
}

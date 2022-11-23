import * as k8s from '@kubernetes/client-node'
import { ERROR_MESSAGE } from 'common/constants/error'
import { Stream } from 'stream'
import WebSocket = require('isomorphic-ws')

interface IProps {
  token: string
  namespace: string
  podName: string
  containerName: string
  tty?: boolean
  command: string
  statusCallback?: (status: k8s.V1Status) => void
}

export const execCMDInPodContainer = async ({
  token,
  namespace,
  podName,
  containerName,
  command,
  tty = true,
  statusCallback
}: IProps): Promise<string> => {
  const kc = new k8s.KubeConfig()
  kc.loadFromString(token)
  const exec = new k8s.Exec(kc)

  const chunks = []
  const errorChunks = []
  // let result = Buffer.from([])
  // let error = Buffer.from([])

  const writableDataStream = new Stream.Writable({
    write: (dataChunk, encoding, next) => {
      chunks.push(dataChunk)
      // Buffer.concat may cause high CPU problem
      // result = Buffer.concat([result, dataChunk])
      next()
    }
  })

  const writableErrorStream = new Stream.Writable({
    write: (dataChunk, encoding, next) => {
      errorChunks.push(dataChunk)
      // result = Buffer.concat([result, dataChunk])
      next()
    }
  })

  const readableStream = new Stream.Readable({
    read: (size) => size
  })

  const binShCommand = ['/bin/sh', '-c', command]
  let timer: NodeJS.Timeout

  try {
    return new Promise((resolve, reject) => {
      exec
        .exec(
          namespace,
          podName,
          containerName,
          binShCommand,
          writableDataStream,
          writableErrorStream,
          readableStream,
          tty,
          (status: k8s.V1Status) => {
            if (statusCallback && statusCallback instanceof Function) {
              statusCallback(status)
            }
            if (status.status === 'Success') {
              clearTimeout(timer)
              resolve(Buffer.concat(chunks).toString())
            } else {
              clearTimeout(timer)
              reject(Buffer.concat(errorChunks).toString())
            }
          }
        )
        .then((conn) => {
          timer = setTimeout(() => {
            if (conn.readyState !== WebSocket.CLOSED) {
              conn.close()
            }
            reject(ERROR_MESSAGE.TIMEOUT_EXCEPTION)
          }, 5000)
        })
    })
  } catch (e) {
    throw new Error(e)
  }
}

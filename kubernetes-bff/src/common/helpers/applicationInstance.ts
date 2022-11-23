import { V1Probe } from '@kubernetes/client-node'

export const makeApplicationInstanceName = ({
  clusterName,
  appName,
  env,
  cid,
  fte
}: {
  clusterName: string
  appName: string
  env: string
  cid: string
  fte?: string
}): string => {
  return `${appName}-${clusterName}-${env}-${cid}${fte ? `-${fte}` : ''}`.toLowerCase()
}

enum ReadinessType {
  COMMAND = 'Command',
  TCP = 'TCP',
  HTTP = 'HTTP'
}

interface IProb {
  type: ReadinessType
  value: string
}

export const parseProbType = (prob: V1Probe): IProb => {
  const { exec, tcpSocket, httpGet } = prob

  let type, value
  if (exec) {
    type = ReadinessType.COMMAND
    value = exec.command.join(' ')
  }

  if (tcpSocket) {
    type = ReadinessType.TCP
    value = tcpSocket.port
  }

  if (httpGet) {
    type = ReadinessType.HTTP
    value = httpGet.path
  }

  return { type, value }
}

interface IProbObj {
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
  type: ReadinessType
  typeValue: string
}

export const generateProbObj = (prob: V1Probe): IProbObj => {
  const { initialDelaySeconds, periodSeconds, successThreshold, timeoutSeconds } = prob

  const { type, value } = parseProbType(prob)

  return {
    initialDelaySeconds,
    periodSeconds,
    successThreshold,
    timeoutSeconds,
    type,
    typeValue: value
  }
}

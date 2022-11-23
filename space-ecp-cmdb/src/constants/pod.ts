export enum PodActions {
  STDOUT_STDERR = 'STDOUT/STDERR',
  VIEW_FILES = 'View Files',
}

export type StepType = {
  description: string
  command: string
}

export const ENTER_CONTAINER_STEPS = (env: string, sduName: string) => [
  {
    description: '1. Install SMC tool:',
    command: 'pip install -i https://pypi.garenanow.com shopee-mesos-cli',
  },
  {
    description: '2. Enter a certain container',
    command: `smc services enter --ecp -e ${env} ${sduName}`,
  },
]

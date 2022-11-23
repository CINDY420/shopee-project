interface IAnnotations {
  key: string
  value: string
}

interface IPaths {
  pathName: string
  pathType: string
  serviceName: string
  servicePort: string
}

interface IHosts {
  name: string
  paths: IPaths[]
}

export interface IEsIngresses {
  name: string
  annotations: IAnnotations[]
  hosts: IHosts[]
  [key: string]: any
}

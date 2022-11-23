export class IESApplication {
  group: string
  project: string
  app: string
  tenant: string
}

export interface IEvent {
  name: string
  namespace: string
  message: string
  reason: string
  kind: string
  creationTimestamp: string
  podip: string
  hostip: string
}

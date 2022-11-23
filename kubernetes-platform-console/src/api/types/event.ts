export interface IEvent {
  name: string
  namespace: string
  message: string
  reason: string
  kind: string
  creationTimestamp: string
  podip?: string
  hostip?: string
}

export interface IEventList {
  events: IEvent[]
  totalCount: number
  kindList: string[]
}

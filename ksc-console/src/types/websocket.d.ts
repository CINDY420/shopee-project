interface IWebSocketMessageEvent extends Event {
  data?: string
}
interface IWebSocketErrorEvent extends Event {
  message: string
}
interface IWebSocketCloseEvent extends Event {
  code?: number
  reason?: string
  message?: string
}

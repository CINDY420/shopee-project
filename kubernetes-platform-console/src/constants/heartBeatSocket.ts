export const HEART_BEAT_MESSAGE = '{ "types": "heartbeat", "input": "", "rows": 0, "cols": 0 }'
export const CLOSE_EVENT_CODE = {
  NORMAL: 1000
}

export interface IWebSocketMessage {
  types: string
  input: string
  rows: number
  cols: number
}

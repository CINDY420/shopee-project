// copy form kubernetes-platform-console

import { HEART_BEAT_MESSAGE, CLOSE_EVENT_CODE } from 'constants/heartBeatSocket'
import { SOCKET_STATUS, DEFAULT_CLOSED_MESSAGE } from 'constants/webSocket'
import XTerm from 'helpers/terminal/xterm'

export enum SOCKET_OPERATION {
  STDIN = 'stdin',
  STDOUT = 'stdout',
  RESIZE = 'resize',
  BIND = 'bind',
}

export interface IWebSocketMessage {
  Operation: string
  SessionId?: string
  Data?: string
  Rows?: number
  Cols?: number
}

interface IProps {
  url: string
  xterm: XTerm
  sessionId: string
}

class HeartBeatSocket extends WebSocket {
  heartBeatTimer: NodeJS.Timer
  xterm: XTerm
  socketErrorMessage: string
  getStatus: (status: SOCKET_STATUS) => void
  getPermission: (permission: boolean) => void
  hasError: boolean
  sessionId: string

  constructor(props: IProps) {
    super(props.url)
    const { xterm, sessionId } = props
    this.xterm = xterm
    this.hasError = false
    this.binaryType = 'arraybuffer'
    this.sessionId = sessionId
    this.onopen = () => this.handleWebSocketOpen()
    this.onmessage = (event: IWebSocketMessageEvent) => this.handleWebSocketMessage(event)
    this.onerror = (event: IWebSocketErrorEvent) => this.handleWebSocketError(event)
    this.onclose = (event: IWebSocketCloseEvent) => this.handleWebSocketClose(event)
  }

  setHeartBeatTimer() {
    this.heartBeatTimer = setInterval(() => {
      if (this.readyState === this.OPEN) this.send(HEART_BEAT_MESSAGE)
    }, 5000)
  }

  sendWebSocketMessage(type: SOCKET_OPERATION, input: string) {
    const message: IWebSocketMessage = {
      Operation: type,
    }
    if (type === SOCKET_OPERATION.BIND) message.SessionId = input

    if (type === SOCKET_OPERATION.STDIN) message.Data = input

    if (type === SOCKET_OPERATION.RESIZE) {
      message.Cols = this.xterm.cols
      message.Rows = this.xterm.rows
    }
    this.send(JSON.stringify(message))
  }

  handleWebSocketOpen() {
    this.sendWebSocketMessage(SOCKET_OPERATION.BIND, this.sessionId)
    if (this.readyState === this.OPEN) {
      this.xterm.fitAddon.fit()
      this.sendWebSocketMessage(SOCKET_OPERATION.RESIZE, '')
    }
  }

  writeDataToXTerm(message: string | ArrayBuffer) {
    if (typeof message === 'string') this.xterm.write(message)
    else {
      const uint8Data = new Uint8Array(message)
      this.xterm.write(uint8Data)
    }
  }

  handleWebSocketMessage(event: IWebSocketMessageEvent) {
    const message = event?.data
    this.getStatus(SOCKET_STATUS.SUCCESS)
    if (message) {
      try {
        const data: IWebSocketMessage = JSON.parse(message)
        if (data.Operation === SOCKET_OPERATION.STDOUT) this.writeDataToXTerm(data?.Data ?? '')
      } catch (error) {
        if (!error.stack.includes('JSON.parse')) console.error(error)

        this.writeDataToXTerm(message)
      }
    }
  }

  handleWebSocketError(event: IWebSocketErrorEvent) {
    const error = event.message
    this.xterm.writeln(`Something error coours: ${error}`)
    this.getStatus(SOCKET_STATUS.FAILED)
    this.hasError = true
  }

  handleWebSocketClose(event: IWebSocketCloseEvent) {
    const { message = DEFAULT_CLOSED_MESSAGE } = event
    if (!this.hasError) {
      this.getStatus(SOCKET_STATUS.CLOSED)
      this.socketErrorMessage = message
      this.xterm.writeln('\r\nWebsocket connect is closed!!!')
    }
  }

  destroy() {
    this.getStatus(SOCKET_STATUS.LOADING)
    clearInterval(this.heartBeatTimer)
    this.close(CLOSE_EVENT_CODE.NORMAL)
    this.onclose = null
  }
}

export default HeartBeatSocket

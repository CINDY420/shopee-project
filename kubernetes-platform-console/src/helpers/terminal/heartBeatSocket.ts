import { HEART_BEAT_MESSAGE, CLOSE_EVENT_CODE, IWebSocketMessage } from 'constants/heartBeatSocket'
import { CONNECT_STATUS, SOCKET_STATUS, DEFAULT_CLOSED_MESSAGE } from 'constants/webSocket'
import XTerm from 'helpers/terminal/xterm'
import FileTransfer from 'helpers/terminal/fileTransfer'

interface IProps {
  url: string
  xterm: XTerm
  fileTransfer: FileTransfer
}

interface ISocketJsonData {
  msg: string
  ret: number
  type: number
}

class HeartBeatSocket extends WebSocket {
  heartBeatTimer: number
  xterm: XTerm
  fileTransfer?: FileTransfer
  socketErrorMessage: string
  getStatus: (status: SOCKET_STATUS) => void
  getPermission: (permission: boolean) => void
  hasError: boolean

  constructor(props: IProps) {
    super(props.url)
    const { xterm, fileTransfer } = props
    this.xterm = xterm
    if (fileTransfer) {
      this.fileTransfer = fileTransfer
      this.fileTransfer.webSocket = this
    }
    this.hasError = false
    this.binaryType = 'arraybuffer'
    this.onopen = this.handleWebSocketOpen
    this.onmessage = this.handleWebSocketMessage
    this.onerror = this.handleWebSocketError
    this.onclose = this.handleWebSocketClose
    this.setHeartBeatTimer()
  }

  setHeartBeatTimer() {
    this.heartBeatTimer = setInterval(() => {
      if (this.readyState === this.OPEN) {
        this.send(HEART_BEAT_MESSAGE)
      }
    }, 5000)
  }

  sendWebSocketMessage(type: string, input: string) {
    const message: IWebSocketMessage = {
      types: type,
      input,
      cols: this.xterm.cols,
      rows: this.xterm.rows
    }
    this.send(JSON.stringify(message))
  }

  handleWebSocketOpen() {
    this.sendWebSocketMessage('login', '')
    if (this.readyState === this.OPEN) {
      this.xterm.fitAddon.fit()
      this.sendWebSocketMessage('resize', '')
    }
  }

  refreshSocketStatus(data: ISocketJsonData) {
    const { ret, msg } = data
    if (ret === CONNECT_STATUS.WEBSOCKET_SUC) {
      this.xterm.reset()
      this.xterm.focus()
    } else if (ret === CONNECT_STATUS.WEBSOCKET_AUTH_ERR) {
      this.getPermission(false)
    } else {
      this.getStatus(SOCKET_STATUS.FAILED)
      this.hasError = true
      this.socketErrorMessage = msg
    }
  }

  writeDataToXTerm(message: string | ArrayBuffer) {
    if (typeof message === 'string') {
      this.xterm.writeln(message)
    } else {
      if (this.fileTransfer) {
        this.fileTransfer.sentry.consume(message)
        const isFileTranfering = this.fileTransfer.isTransfering
        if (!isFileTranfering) {
          const uint8Data = new Uint8Array(message)
          this.xterm.write(uint8Data)
        }
      } else {
        const uint8Data = new Uint8Array(message)
        this.xterm.write(uint8Data)
      }
    }
  }

  handleWebSocketMessage(event: WebSocketMessageEvent) {
    const message = event.data
    this.getStatus(SOCKET_STATUS.SUCCESS)
    try {
      const data = JSON.parse(message)
      this.refreshSocketStatus(data)
    } catch (error) {
      if (!error.stack.includes('JSON.parse')) {
        console.error(error)
      }
      this.writeDataToXTerm(message)
    }
  }

  handleWebSocketError(event: WebSocketErrorEvent) {
    const error = event.message
    this.xterm.writeln(`Something error coours: ${error}`)
    this.getStatus(SOCKET_STATUS.FAILED)
    this.hasError = true
  }

  handleWebSocketClose(event: WebSocketCloseEvent) {
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

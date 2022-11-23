import { HEART_BEAT_MESSAGE, CLOSE_EVENT_CODE } from 'constants/heartBeatSocket'

class HeartBeatSocket extends WebSocket {
  heartBeatTimer
  heartBeatTimeout = 5000

  constructor (props) {
    super(props)
    this.heartBeatTimer = setInterval(() => {
      this.send(HEART_BEAT_MESSAGE)
    }, this.heartBeatTimeout)
  }

  destroy () {
    clearInterval(this.heartBeatTimer)
    this.close(CLOSE_EVENT_CODE.NORMAL)
    this.onclose = null
  }
}

export default HeartBeatSocket

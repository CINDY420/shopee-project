import Zmodem from 'zmodem.js'
import streamSaver from 'streamsaver'
import XTerm from 'helpers/terminal/xterm'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'

interface IProps {
  xterm: XTerm
  uploadElement: HTMLInputElement
}

interface IDeatilsProps {
  name: string
  size: number
}

interface IXferProps {
  get_details: () => IDeatilsProps
  _file_offset: number
}

const ERASE_CURRENT_LINE_COMMAND = '\x1b[2K\r'

class FileTransfer {
  xterm: XTerm
  webSocket: HeartBeatSocket
  sentry: Zmodem.Sentry
  session: Zmodem.Session
  uploadElement: HTMLInputElement
  onFocusTimeout: number
  writer: WritableStreamDefaultWriter
  isTransfering: boolean
  getIsTransfering: (isTransfering: boolean) => void
  uploadProgressDot: string
  uploadInterval: number | null

  constructor (props: IProps) {
    const { xterm, uploadElement } = props
    this.xterm = xterm
    this.uploadElement = uploadElement
    this.isTransfering = false
    this.sentry = new Zmodem.Sentry({
      to_terminal: () => null,
      on_detect: this.onDetect.bind(this),
      sender: this.sender.bind(this),
      on_retract: () => null
    })
    this.handleFileChange = this.handleFileChange.bind(this)
    this.uploadProgressDot = ''
    this.uploadInterval = null
  }

  updateTransferStatus (status: boolean) {
    this.isTransfering = status
    this.getIsTransfering(status)
  }

  onDetect (detection: Zmodem.Detection) {
    const session: Zmodem.Session = detection.confirm()
    this.session = session
    this.updateTransferStatus(true)
    if (session.type === 'send') {
      this.upload()
    } else {
      this.download()
    }
  }

  upload () {
    this.uploadElement.click()
    document.body.onfocus = () => {
      this.onFocusTimeout = setTimeout(() => {
        if (this.uploadElement.files.length < 1) {
          this.xterm.write(ERASE_CURRENT_LINE_COMMAND)
          this.xterm.writeln('Upload file cancled.')
          this.closeZession()
          document.body.onfocus = null
          this.updateTransferStatus(false)
        }
      }, 500)
    }
  }

  handleFileChange () {
    document.body.onfocus = null
    clearTimeout(this.onFocusTimeout)
    Zmodem.Browser.send_files(this.session, this.uploadElement?.files || [], {
      on_offer_response: this.onOfferResponse.bind(this),
      on_file_complete: this.onFileCompelted.bind(this)
    }).then(
      () => {
        this.closeZession()
      },
      () => {
        this.xterm.write(ERASE_CURRENT_LINE_COMMAND)
        this.xterm.writeln('Upload file failed, please try again.')
        this.closeZession()
      }
    )
  }

  playUploadProgressAnimation (filename: string) {
    this.xterm.write(`File ${filename} uploading...`)
    this.uploadInterval = setInterval(() => {
      const uploadProgressDot = this.uploadProgressDot
      if (uploadProgressDot.length >= 3) {
        this.uploadProgressDot = ''
      } else {
        this.uploadProgressDot = uploadProgressDot + '.'
      }
      this.xterm.write(ERASE_CURRENT_LINE_COMMAND)
      this.xterm.write(`File ${filename} uploading${this.uploadProgressDot}`)
    }, 500)
  }

  clearUploadProgressAnimation () {
    clearInterval(this.uploadInterval)
    this.uploadInterval = null
    this.uploadProgressDot = ''
  }

  onOfferResponse (obj: { name: string }, xfer: IXferProps) {
    if (xfer) {
      this.playUploadProgressAnimation(obj.name)
    } else {
      this.xterm.writeln(`${obj.name} is already existed!`)
    }
  }

  onFileCompelted (obj: { name: string }) {
    this.xterm.write(ERASE_CURRENT_LINE_COMMAND)
    this.xterm.writeln(`File ${obj.name} complete upload!`)
    this.clearUploadProgressAnimation()
  }

  onDownloadEnd (message: string) {
    this.writer = null
    this.xterm.writeln(`\r\n${message}`)
    this.updateTransferStatus(false)
  }

  download () {
    const session: Zmodem.Session = this.session
    session.on('offer', xfer => {
      const detail = xfer.get_details()
      const { name, size } = detail
      const fileStream = streamSaver.createWriteStream(name, {
        size,
        writableStrategy: undefined,
        readableStrategy: undefined
      })
      this.writer = fileStream.getWriter()
      if (xfer) {
        xfer.on('input', payload => {
          this.updateDownloadProgress(xfer)
          this.writer.write(new Uint8Array(payload)).catch(e => e)
        })

        xfer.accept().then(
          () => {
            this.writer.close()
            this.onDownloadEnd('Download file success!')
          },
          () => {
            this.writer.abort()
            this.onDownloadEnd('Download file failed, please try again.')
          }
        )
      }
    })

    session.start()
  }

  updateDownloadProgress (xfer: IXferProps) {
    const detail = xfer.get_details()
    const { name, size } = detail
    let percent
    if (size === 0) {
      percent = 100
    } else {
      percent = Math.round((xfer._file_offset / size) * 100)
    }
    this.xterm.write(ERASE_CURRENT_LINE_COMMAND)
    this.xterm.write(`File ${name} downloading: ${percent}%`)
  }

  sender (octets: ArrayLike<number> | ArrayBufferLike) {
    this.webSocket?.send(new Uint8Array(octets))
  }

  closeZession () {
    this.updateTransferStatus(false)
    const session = this.session
    const uploadElement = this.uploadElement
    if (session) {
      session._last_header_name = 'ZRINIT'
      session?.close()
      uploadElement.value = ''
    }
  }

  resetFileTransfer () {
    if (this.writer) {
      this.writer.abort()
      this.writer = null
    }
    this.updateTransferStatus(false)
    this.clearUploadProgressAnimation()
  }
}

export default FileTransfer

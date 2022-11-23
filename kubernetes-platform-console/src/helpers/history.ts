import { createBrowserHistory } from 'history'
import { Modal } from 'infrad'

const getUserConfirmation = (message: string, callback: (result: boolean) => void) => {
  const { title, content, okText, cancelText } = JSON.parse(message)

  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    onOk () {
      callback(true)
    },
    onCancel () {
      callback(false)
    }
  })
}

const history = createBrowserHistory({ getUserConfirmation })

export default history

import { Location } from 'history'
import { useEffect, useState } from 'react'
import { Prompt, useHistory } from 'react-router-dom'
import { Modal, ModalFuncProps } from 'infrad'

// Refer to https://michaelchan-13570.medium.com/using-react-router-v4-prompt-with-custom-modal-component-ca839f5faf39

export interface IRouteLeavingConfirmProps extends ModalFuncProps {
  /**
   * Enable confirm or not
   * @default true
   */
  when?: boolean
}

const RouteLeavingConfirm: React.FC<IRouteLeavingConfirmProps> = ({ when, onOk, ...others }) => {
  const history = useHistory()

  const [nextLocation, setNextLocation] = useState<Location | null>(null)
  const [confirmed, setConfirm] = useState(false)

  const shouldBlock = (location: Location) => location.pathname !== history.location.pathname
  const handleModalOK = () => {
    onOk?.()
    setConfirm(true)
  }

  const handleMessage = (nextLocation: Location): boolean => {
    if (!confirmed && shouldBlock(nextLocation)) {
      setNextLocation(nextLocation)
      // show confirm modal
      Modal.confirm({
        onOk: handleModalOK,
        ...others,
      })
      return false
    }
    return true
  }

  useEffect(() => {
    if (confirmed && nextLocation) {
      history.push(nextLocation.pathname)
    }

    return () => setConfirm(false)
  }, [confirmed, history, nextLocation])

  return <Prompt when={when} message={handleMessage} />
}
export default RouteLeavingConfirm

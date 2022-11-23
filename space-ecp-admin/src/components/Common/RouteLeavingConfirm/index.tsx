import { Location } from 'history'
import { useEffect, useState } from 'react'
import { Prompt } from 'react-router-dom'
import { Modal, ModalFuncProps } from 'infrad'
import { useHistory } from 'react-router'

const RouteLeavingConfirm: React.FC<ModalFuncProps> = ({ onOk, ...others }) => {
  const history = useHistory()

  const [nextLocation, setNextLocation] = useState<Location | null>(null)
  const [confirmed, setConfirm] = useState(false)

  const shouldBlock = (location: Location) => location.pathname !== history.location.pathname
  const handleModalOK = () => {
    onOk && onOk()
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
  }, [confirmed, history, nextLocation])

  return <Prompt message={handleMessage} />
}
export default RouteLeavingConfirm

import React, { useState } from 'react'
import { Modal, Checkbox, Button } from 'infrad'
import { ModalProps } from 'infrad/lib/modal/Modal'
interface IGotItModalProps extends ModalProps {
  deployConfigEnable?: boolean
}
const GotItModal: React.FC<IGotItModalProps> = ({
  children,
  okText,
  cancelText,
  onOk,
  onCancel,
  deployConfigEnable,
  visible,
  ...others
}) => {
  const [isGotIt, setGotIt] = useState(false)
  const handleGotIt = e => setGotIt(e.target.checked)
  const confirmButtonRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    if (visible) {
      confirmButtonRef?.current?.focus()
    }
  }, [visible])

  const Footer = (
    <div style={{ overflow: 'auto' }}>
      {deployConfigEnable && (
        <span style={{ float: 'left' }}>
          <Checkbox onChange={handleGotIt}>Got it !</Checkbox>
        </span>
      )}
      <span style={{ float: 'right' }}>
        <Button onClick={onCancel}>{cancelText || 'Cancel'}</Button>
        <Button
          ref={confirmButtonRef}
          disabled={!isGotIt && deployConfigEnable}
          onClick={onOk}
          style={{ marginLeft: 16 }}
          type='primary'
        >
          {okText || 'Confirm'}
        </Button>
      </span>
    </div>
  )
  return (
    <Modal visible={visible} footer={Footer} {...others} onOk={onOk} onCancel={onCancel}>
      {children}
    </Modal>
  )
}
export default GotItModal

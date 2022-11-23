import { Modal } from 'infrad'
import type { ModalFuncProps } from 'infrad/lib/modal/Modal'

type ConfirmModalProps = Omit<ModalFuncProps, 'onOk' | 'onCancel'>
export const antdConfirm = (props: ConfirmModalProps) =>
  new Promise<boolean>((resolve) => {
    Modal.confirm({
      ...props,
      onOk: () => {
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      },
    })
  })

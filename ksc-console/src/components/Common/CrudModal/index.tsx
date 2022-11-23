import React from 'react'
import { Button } from 'infrad'
import { StyledModel } from './style'
import { ModalProps } from 'infrad/lib/modal'

interface ICrudModalProps extends ModalProps {
  /** Control the disabled state of submit button */
  title?: string
  isSubmitDisabled?: boolean
  isSubmitLoading?: boolean
  children?: React.ReactNode
  onOk?: () => void
  onCancel?: () => void
}

const CrudModal = (props: ICrudModalProps) => {
  const {
    title,
    isSubmitDisabled = false,
    isSubmitLoading = false,
    cancelText = 'Cancel',
    okText = 'Submit',
    onCancel: handleCancel,
    onOk: handleOk,
    ...restProps
  } = props

  return (
    <StyledModel
      title={title}
      width={640}
      closable={false}
      maskClosable={false}
      getContainer={document.body}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {cancelText}
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={isSubmitDisabled}
          onClick={handleOk}
          loading={isSubmitLoading}
        >
          {okText}
        </Button>,
      ]}
      {...restProps}
    >
      {props.children}
    </StyledModel>
  )
}

export default CrudModal

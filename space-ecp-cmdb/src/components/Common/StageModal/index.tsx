import * as React from 'react'
import { Alert, AlertProps, Button, Spin } from 'infrad'
import { InfoCircleOutlined } from 'infra-design-icons'
import { StyledModal } from 'src/components/Common/StageModal/style'

export enum Stage {
  EDIT = 'edit',
  CONFIRM = 'confirm',
}

interface IStageModalProps {
  visible: boolean
  stage: Stage
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onNextStage: () => Promise<void> | void
  onReturn: () => void
  onConfirm: () => Promise<void> | void
  loading: boolean
  children: React.ReactNode
  title: React.ReactNode
  handbookLink?: string
  notice?: React.ReactNode
  noticeType?: AlertProps['type']
  width?: number
  nextButtonDisabled?: boolean
  confirmLoading?: boolean
}

const StageModal: React.FC<IStageModalProps> = (props) => {
  const {
    visible,
    stage,
    onCancel,
    onNextStage,
    onReturn,
    onConfirm,
    loading,
    children,
    title,
    handbookLink,
    notice,
    noticeType = 'info',
    width = 800,
    nextButtonDisabled = false,
    confirmLoading,
  } = props

  const MODAL_FOOTER_MAP = {
    [Stage.EDIT]: [
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="next" type="primary" onClick={onNextStage} disabled={nextButtonDisabled}>
        Next
      </Button>,
    ],
    [Stage.CONFIRM]: [
      <Button key="return" onClick={onReturn}>
        Return
      </Button>,
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="confirm" type="primary" onClick={onConfirm} loading={confirmLoading}>
        Confirm
      </Button>,
    ],
  }

  return (
    <StyledModal
      visible={visible}
      width={width}
      onCancel={onCancel}
      title={
        <>
          {title}
          {handbookLink && (
            <InfoCircleOutlined
              style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 8 }}
              onClick={() => {
                window.open(handbookLink)
              }}
            />
          )}
        </>
      }
      footer={MODAL_FOOTER_MAP[stage]}
    >
      {notice && <Alert message={notice} type={noticeType} showIcon />}
      <Spin spinning={loading}>{children}</Spin>
    </StyledModal>
  )
}

export default StageModal

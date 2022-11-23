import styled from 'styled-components'
import { Card, Button, Modal, Row, ModalProps } from 'infrad'

export const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 24px;
    border: none;
    .ant-card-head-title {
      padding: 24px 0 0 0;
    }
  }
  .ant-card-body {
    padding: 16px 24px;
  }
`

export const StyledButton = styled(Button)`
  &:first-child {
    padding-left: 0;
  }
`

interface IStyledModalProps extends ModalProps {
  isFullScreen?: boolean
}
export const StyledModal = styled(Modal)<IStyledModalProps>`
  top: ${(props) => (props.isFullScreen ? 0 : '100px')};
  .ant-modal-content {
    height: ${(props) => (props.isFullScreen ? `${window.innerHeight - 24}px` : 'auto')};
  }
  .ant-modal-header {
    padding: 12px 24px;
  }
  .ant-modal-close {
    .ant-modal-close-x {
      margin-top: 5px;
      height: 46px;
      line-height: 46px;
    }
  }
`

export const StyledRow = styled(Row)`
  margin-right: 25px;
`

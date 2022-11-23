import styled from 'styled-components'
import { Modal } from 'infrad'

export const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: flex;
    justify-content: center;
    padding: 24px;

    .ant-btn {
      width: 160px;
      height: 40px;
    }

    .ant-btn + .ant-btn:not(.ant-dropdown-trigger) {
      margin-left: 16px;
    }
  }
`

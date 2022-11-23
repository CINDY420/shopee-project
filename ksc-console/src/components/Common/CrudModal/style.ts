import styled from 'styled-components'
import { Modal } from 'infrad'

export const StyledModel = styled(Modal)`
  .ant-modal-content {
    .ant-modal-header {
      padding: 16px 24px;
      font-size: 22px;
      line-height: 24px;
      border-bottom: 1px solid #eeeeee;
    }
    .ant-modal-body {
      min-height: 100px;
      padding: 0;
    }
    .ant-modal-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px 0;
      border-top: 1px solid #eeeeee;
      .ant-btn {
        width: 160px;
        height: 40px;
        &:not(:first-child) {
          margin-left: 16px;
        }
      }
    }
  }
`

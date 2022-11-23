import styled from 'styled-components'
import { Modal, Form } from 'infrad'

export const StyledDiv = styled.div`
  width: 240px;
  border-right: 1px solid #e5e5e5;
`

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: 0;
  }

  .ant-modal-footer {
    border-top: 0;
  }
`

export const StyledForm = styled(Form)`
  .ant-form-item-label > label.ant-form-item-required::before {
    display: none;
  }
`

import styled from 'styled-components'
import { Divider, Modal as AntdModal } from 'infrad'

export const Wrapper = styled.div`
  border: 1px solid #e5e5e5;
  padding: 16px 24px;
`

export const StyledDivider = styled(Divider)`
  margin: 16px 0;
  border-top: 1px solid #e5e5e5;
`

export const Info = styled.div`
  color: #999;
  font-size: 12px;
  margin-top: 11px;
`

export const Modal: any = styled(AntdModal)`
  .ant-modal-header {
    border-bottom-width: 0;
    padding: 16px;
  }

  .ant-modal-body {
    padding: 0 16px;
  }

  .ant-modal-footer {
    border-top-width: 0;
    padding: 16px;
  }
`

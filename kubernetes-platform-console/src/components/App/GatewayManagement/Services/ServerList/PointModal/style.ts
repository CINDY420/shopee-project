import styled from 'styled-components'
import { Modal as AntdModal } from 'infrad'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'

export const FooterWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
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

export const PointWrapper = styled.div`
  max-height: 214px;
  border: 1px solid #e5e5e5;
  overflow-y: auto;
  padding: 4px 8px;
`

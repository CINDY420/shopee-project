import styled from 'styled-components'
import { Form } from 'infrad'

import { HorizonCenterWrapper } from 'common-styles/flexWrapper'

export const FormRoot = styled.div`
  padding: 0;
`

export const ClusterIPWrapper = styled.div``

export const ListWrapper = styled(HorizonCenterWrapper)`
  justify-content: space-between;
  background: #f6f6f6;
  border-radius: 4px;
  padding: 16px 24px;

  .ant-form-item-label label {
    font-size: 14px;
    font-weight: normal;
  }
`

export const ItemWrapper = styled.div`
  min-width: 360px;
`

export const StyledListItem = styled(Form.Item)`
  margin-bottom: 16px !important;
`

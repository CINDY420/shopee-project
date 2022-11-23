import styled from 'styled-components'
import { Form, Select } from 'infrad'

const { Item } = Form

export const TableWrapper = styled.div`
  background-color: #fafafa;
  padding: 0 16px 4px 16px;
`

export const StyledTable = styled.table`
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
`
export const StyledTHead = styled.thead`
  font-size: 12px;
  color: #999999;
  font-weight: 400;
  font-style: normal;
  line-height: 14px;
`

export const StyledTr = styled.tr`
  font-size: 14px;
  color: #999999;
  font-style: normal;
  height: 48px;
`

export const StyledFormItem = styled(Item)`
  margin-bottom: 0;
  margin-right: 8px;
`

export const ErrorInfo = styled.tr`
  color: #ff4742;
  height: 24px;
`

export const StyledSelect: any = styled(Select)`
  &.ant-select-open .ant-select-selector {
    max-height: inherit;
    overflow: inherit;
  }

  .ant-select-selector {
    max-height: 200px;
    overflow: auto;
  }
`

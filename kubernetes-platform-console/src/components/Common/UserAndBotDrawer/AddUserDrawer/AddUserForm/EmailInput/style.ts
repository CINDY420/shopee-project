import styled from 'styled-components'
import { Button, Select } from 'infrad'

export const ListContent = styled.div`
  background-color: #f6f6f6;
  padding: 16px 24px;
`

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const AddButton: any = styled(Button)`
  width: 360px;
  margin-left: 24px;
  border-color: #2673dd;
  color: #2673dd;
  font-weight: 500;
`

export const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 150px;
    display: block;
    overflow-x: hidden;
    overflow-y: auto;

    .ant-select-selection-item {
      display: inline-flex;
    }

    .ant-select-selection-search-input {
      width: auto;
    }

    .ant-select-selection-placeholder {
      top: 16px;
      left: 12px;
    }
  }
`

export const StyledLabel = styled.span`
  color: #333333;
  font-size: 16px;
  font-weight: 500;
`

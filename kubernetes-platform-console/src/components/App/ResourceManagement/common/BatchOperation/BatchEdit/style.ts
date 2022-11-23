import { Col, Descriptions, Form } from 'infrad'
import styled from 'styled-components'
import { Table } from 'common-styles/table'

export const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #000000;
  margin-bottom: 24px;
`

export const StyledForm = styled(Form)`
  .ant-form-item {
    flex-wrap: nowrap;
  }

  .ant-col {
    max-width: unset;
    display: inline-flex;
    align-items: baseline;
  }

  .ant-form-item-control-input {
    width: 100%;
  }

  .ant-checkbox-wrapper {
    margin-right: 12px;
  }
`

export const StyledCol = styled(Col)`
  max-width: unset;
`

export const StyledTable = styled(Table)`
  .ant-table-tbody > tr > td {
    padding: 16px;
  }
`

export const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    min-width: 350px;
    color: #434343;
  }

  .ant-descriptions-item-content {
    color: #666666;
  }
`

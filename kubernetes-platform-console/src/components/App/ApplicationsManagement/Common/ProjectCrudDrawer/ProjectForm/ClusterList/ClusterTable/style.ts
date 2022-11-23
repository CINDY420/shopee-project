import styled from 'styled-components'
import { Form, Input } from 'infrad'
import { Table } from 'common-styles/table'

const { Item } = Form

export const Root = styled.div`
  margin-left: 24px;
`

export const RowWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    display: inline-block;
    width: 33%;
    text-align: left;
  }

  .unit {
    color: #999;
    font-size: 12px;
    font-weight: 400;
  }
`

export const StyledFormItem = styled(Item)`
  margin-bottom: 0;

  & .ant-form-item-explain + .ant-form-item-extra {
    display: none;
  }
`

export const StyledInput = styled(Input)`
  width: 115px;

  .ant-input {
    padding: 4px;
    padding-right: 0;
  }

  .ant-input-group-addon {
    background: transparent;
    font-size: 0.8em;
    padding: 0 0.5em;
  }
`

export const StyledTable = styled(Table as any)`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding-left: 0;
    padding-right: 0;
    border-right: 0 !important;
  }
`

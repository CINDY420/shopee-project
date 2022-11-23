import styled from 'styled-components'
import { QuestionCircleOutlined } from 'infra-design-icons'
import { Table, Tooltip } from 'infrad'

export const StyledTable: any = styled(Table)`
  .ant-table-thead > tr:nth-child(1) > th {
    background-color: #666666;
    color: #ffffff;
    font-weight: normal;
  }
  .ant-table-thead > tr:nth-child(2) > th {
    background-color: #d9d9d9;
    color: #434343;
    font-weight: normal;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    position: relative;
    padding: 8px 16px;
    overflow-wrap: unset;
    text-align: center;
  }
`

export const StyledTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    padding: 8px;
    background-color: #ffffff;
    color: #666666;
  }
  .ant-tooltip-arrow {
    color: #ffffff;
  }
`

export const StyledQuestionCircleOutlined = styled(QuestionCircleOutlined)`
  margin-left: 6px;
  cursor: pointer;
  color: #999999;
`

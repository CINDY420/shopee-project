import styled from 'styled-components'
import { Table } from 'infrad'

export const RuntimeContent = styled.div`
  width: 50%;
`

export const ExtraArgsTitle = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
`

export const StyledTable: typeof Table = styled(Table)`
  .ant-table,
  .ant-table-summary {
    background-color: transparent;
  }

  .ant-table table {
    border-spacing: 8px 0;
    border-spacing: 0;
  }

  .ant-table-placeholder {
    display: none;
  }

  .ant-table-thead > tr > th {
    background-color: transparent !important;
    color: inherit;
    font: inherit;
    padding: 11px 0;
    border: none;
  }

  .ant-table-thead > tr > th:last-child {
    width: 32px;
  }

  .ant-table-tbody > tr > td {
    padding: 0;
    border: none;
  }

  .ant-table-summary > tr > td {
    padding: 0 0 16px 0;
    border: none;
  }

  .ant-table-cell::before {
    display: none;
  }
`

export const CertificateWrapper = styled.div`
  margin: 25px 0 16px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`

export const ObservabilityContent = styled.div`
  width: 50%;
`

export const OperatorWrapper = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

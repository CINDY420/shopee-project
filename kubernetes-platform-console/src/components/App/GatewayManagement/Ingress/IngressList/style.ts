import styled from 'styled-components'

import { Table } from 'common-styles/table'

import { Select } from 'infrad'

import { SearchOutlined, InfoCircleOutlined } from 'infra-design-icons'

export const Title = styled.div`
  font-size: 32px;
  color: #333;
  line-height: 36px;
  font-weight: 500;
`

export const IngressNameWrapper = styled.div`
  .ant-tooltip {
    max-width: 500px;
  }
`

export const NameWrapper = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
`

export const Annotations = styled.div`
  font-size: 14px;
  color: #999;
  font-weight: 400;
`

export const SearchBox = styled.div`
  .ant-select-show-search {
    margin-left: 0px;
  }
`

export const StyledSelect = styled(Select)`
  margin-left: 10px;
  width: 480px;
  .ant-select-selection-search {
    min-width: 5px;
  }
  .ant-select-selector {
    padding-right: 30px;
  }
`

export const StyledSearchOutlined = styled(SearchOutlined)`
  width: 20px;
  height: 20px;
  position: relative;
  left: -25px;
`

export const StyledInfoCircleOutlined = styled(InfoCircleOutlined)`
  margin-right: 3px;
`

export const StyledTable = styled(Table)`
  .ant-table-body .ant-table-cell {
    padding: 24px !important;
  }
`

export const PaginationWrapper = styled.div`
  float: right;
  margin: 16px 0;
`

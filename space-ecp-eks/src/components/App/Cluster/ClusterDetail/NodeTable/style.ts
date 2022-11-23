import styled from 'styled-components'
import { Table } from 'src/common-styles/table'
import { Button, Dropdown, Popover } from 'infrad'

export const StyledTable = styled(Table)`
  span.ant-dropdown-menu-title-content {
    white-space: nowrap;
  }
`

export const StyledStatusTable = styled(StyledTable)`
  width: 832px;

  .ant-table-tbody > tr > td {
    padding: 16px;
  }

  .ant-table-container {
    border: none;
  }
`

export const StyledButton = styled(Button)`
  padding: 0;
`

export const StyledDropdown = styled(Dropdown)`
  z-index: 100;
`

export const StyledLabelFiltersContainer = styled.div`
  margin-top: 16px;

  & > span {
    margin-right: 5px;
  }

  & > button {
    padding: 0 5px;
  }
`

export const StyledPopover = styled(Popover)`
  .ant-popover-title {
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-popover-inner-content {
    padding: 12px 16px;
  }
`

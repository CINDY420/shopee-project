import styled from 'styled-components'
import { Tag, Popover } from 'infrad'

export const Key = styled.span`
  color: #888888;
`

interface IProps {
  isLast: boolean
}

export const TaintWrapper = styled.div<IProps>`
  margin-bottom: ${props => (props.isLast ? '0px' : '32px')};
  .ant-tooltip-arrow {
    display: none;
  }
  .ant-tooltip-inner {
    border-radius: 4px;
    padding: 4px 8px;
  }
`

export const TaintValueWrapper = styled.div`
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`

export const StyledTag = styled(Tag)`
  margin-top: 8px;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StatusTextWrapper = styled.p`
  max-width: 100px;
  margin: 0;
`

export const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  .ant-table-container {
    display: table;
    min-width: 100%;
  }
`

export const StyledPopover = styled(Popover)`
  .ant-popover-placement-top {
    padding-bottom: 0px;
  }
  .ant-popover-inner-content {
    background: #000;
    color: #fff;
    padding: 4px 8px;
  }
  .ant-popover-arrow {
    display: none;
  }
`

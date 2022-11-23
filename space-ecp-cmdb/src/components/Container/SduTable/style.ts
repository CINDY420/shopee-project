import { Tag } from 'infrad'
import styled from 'styled-components'
import { Table } from 'src/common-styles/table'

export const ButtonGroups = styled.div`
  display: flex;
`
interface ILinkButtonProps {
  disabled?: boolean
}

export const LinkButton = styled.div<ILinkButtonProps>`
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  line-height: 28px;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'unset')};
  opacity: ${(props) => (props.disabled ? '0.4' : '1')};

  & + & {
    border-left: 0px;
  }
`

export const StyledSduTable = styled(Table)`
  .ant-table-row-level-0 {
    .sduName {
      white-space: nowrap;

      .anticon {
        position: absolute;
        top: 50%;
        cursor: pointer;
      }
    }
  }
`

export const SduMeta = styled.div`
  width: 200px;
  margin-left: 24px;
  font-weight: 500;
  display: inline-block;
  white-space: pre-line;

  div {
    color: rgba(0, 0, 0, 0.45);
    font-weight: 400;
  }
`

export const StateTag = styled.div`
  display: flex;
  align-items: center;

  .ant-badge-count {
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    line-height: 16px;
    border-radius: 8px;
  }

  & + & {
    margin-top: 8px;
  }
`

export const StateReason = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`

export const PhaseTag = styled(Tag)`
  & + & {
    margin-top: 8px;
  }
`

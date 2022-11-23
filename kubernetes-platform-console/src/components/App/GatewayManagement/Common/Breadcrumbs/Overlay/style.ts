import styled from 'styled-components'
import { Input, List } from 'infrad'

const { Search } = Input

interface IProps {
  open: boolean
}

export const Wrapper = styled.div`
  display: inline-block;
  padding: 0 0.7em;
  z-index: 100;
  margin-right: -0.7em;
`

export const Dropdown = styled.div<IProps>`
  background-color: white;
  width: 15em;
  height: 16em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: ${props => (props.open ? 'block' : 'none')};
  position: absolute;
  transform: translate(-50%);
`

export const ListWrapper = styled.div`
  width: 100%;
  height: calc(100% - 36px);
  overflow: auto;
`

export const StyledList = styled(List)`
  width: 100%;
  .ant-list-item {
    font-size: 0.8em;
    border: none;
    padding: 5px 12px;
  }
  .ant-list-item:hover {
    background-color: #e6f7ff;
  }
  .ant-list-header {
    padding: 0;
  }
  &:hover {
    cursor: pointer;
  }
`

export const StyledInput = styled(Input)`
  width: 11em;
  margin: 0.5em;
`
export const StyledSearch = styled(Search)`
  width: 14em;
  margin: 0.5em;
  .ant-input-search-icon {
    font-size: 10px;
  }
`

export const Item = styled.div`
  font-size: 1.2em;
  word-break: break-all;
`

export const Note = styled.div`
  color: rgba(0, 0, 0, 0.45);
  word-break: break-all;
`

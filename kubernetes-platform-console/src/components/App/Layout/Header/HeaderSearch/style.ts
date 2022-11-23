import styled from 'styled-components'
import { Input, Spin, List } from 'infrad'

const { Item } = List

export const StyledListItem = styled(Item)`
  &.ant-list-item {
    border-bottom: none;
    width: 100%;
  }
`

export const StyledSpin = styled(Spin)`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Root = styled.div`
  width: 100%;
  max-width: 480px;
  position: relative;
`

export const StyledInput = styled(Input)`
  border: 0;
  width: 100%;
  background: rgba(62, 66, 74);

  .ant-input {
    background: rgba(62, 66, 74);
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
    color: rgba(255, 255, 255, 1);
  }
`

interface IProps {
  open: boolean
}

export const ListContainer = styled.div<IProps>`
  width: 100%;
  position: absolute;
  top: 43px;
  border-radius: 2px;
  background: white;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: ${props => (props.open ? '1' : '0')};
  z-index: ${props => (props.open ? '999' : '-1')};
  overflow: hidden;
  transition: all 0.3s;
`

export const ResourceContainer = styled.div`
  width: 100%;
  padding: 4px 12px;
  height: 50px;
  :hover {
    background: #e6f7ff;
  }
`

export const ResourceName = styled.p`
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  line-height: 16px;
  margin: 0;
  padding: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ResourceRemark = styled.p`
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 14px;
  margin: 0;
  padding: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const StyledDiv = styled.div`
  user-select: none;
  cursor: pointer;
`

export const ListTitle = styled.div`
  line-height: initial;
  padding: 6px 12px;
  color: #333333;
  font-weight: 500;
`

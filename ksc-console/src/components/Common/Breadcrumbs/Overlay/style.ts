import styled from 'styled-components'
import { Input, List } from 'infrad'

export const Wrapper = styled.div`
  display: inline-block;
  width: 15em;
  z-index: 100;
  margin-left: 24px;
  background-color: #fff;
`
export const StyledInput = styled(Input)`
  height: 30px;
  line-height: 30px;
  margin: 0 0 3px 0;
  padding: 0 12px;
`
export const ListWrapper = styled.div`
  width: 100%;
  height: 180px;
  padding-bottom: 5px;
  overflow: auto;
`

export const StyledList = styled(List)`
  width: 100%;
  .ant-list-item {
    display: block;
    height: 32px;
    line-height: 32px;
    font-size: 0.8em;
    border: none;
    padding: 0 12px;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

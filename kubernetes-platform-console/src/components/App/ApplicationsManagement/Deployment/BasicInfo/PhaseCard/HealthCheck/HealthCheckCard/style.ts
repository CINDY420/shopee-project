import styled from 'styled-components'

export const Root = styled.div`
  padding: 8px;
  background: #f6f6f6;
`

export const Item = styled.div`
  color: #333;
  font-size: 14px;
  word-break: break-all;
  margin-bottom: 8px;

  &:nth-last-of-type {
    margin-bottom: 0;
  }

  & span {
    font-size: 12px;
    color: #999;
    margin-right: 3px;
  }
`

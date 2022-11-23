import styled from 'styled-components'

export const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
`

export const TaintWrapper = styled.div`
  padding-right: 30px;
  padding-bottom: 24px;

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
  color: #333;

  span {
    color: #888;
  }
`

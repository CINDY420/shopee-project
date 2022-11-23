import styled from 'styled-components'

export const StyledBasic = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`
export const StyledSingleInfo = styled.div`
  display: flex;
  min-width: calc((100% - 32px) / 3);
  margin: 0 0 24px 16px;
  font-size: 14px;
  :nth-child(3n + 1) {
    margin-left: 0;
  }
`
export const StyledInfoName = styled.div`
  color: #999999;
`
export const StyledInfoValue = styled.div`
  flex-grow: 1;
  margin-left: 16px;
  color: #333333;
  overflow: auto;
`

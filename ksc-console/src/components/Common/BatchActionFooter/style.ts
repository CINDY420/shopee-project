import { Button } from 'infrad'
import styled from 'styled-components'

export const StyledDivider = styled.div`
  width: 100%;
  height: 72px;
`

export const StyledRoot = styled.div`
  position: fixed;
  left: 224px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 248px);
  height: 72px;
  padding: 0 24px;
  border: 1px solid #f0f0f0;
  background-color: #ffffff;
  z-index: 2;
`

export const StyledTitle = styled.div`
  height: 24px;
  line-height: 24px;
  font-weight: 500;
`

export const StyledSelected = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
`

export const StyledButton = styled(Button)`
  margin-left: 8px;
`

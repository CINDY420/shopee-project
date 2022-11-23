import styled from 'styled-components'
import { Empty } from 'infrad'

export const Root = styled.div`
  border: 1px solid #d9d9d9;
  padding: 24px;
  margin-bottom: 26px;
  width: 100%;
  min-height: 225px;
`

export const TitleWrapper = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
`

export const InfoWrapper = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
`

export const StyledEmpty = styled(Empty)`
  margin: 0;
`

export const SpinWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

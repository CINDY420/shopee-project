import styled from 'styled-components'

export const Root = styled.div<{ paddingBottom?: string }>`
  padding: 16px 24px ${({ paddingBottom }) => paddingBottom ?? '24px'} 24px;
  background-color: #ffffff;
`

export const ActionWrapper = styled.div`
  float: right;
`

export const EnvGroupWrapper = styled.div`
  padding: 16px 0;
`

export const EnvWrapper = styled.span`
  text-transform: capitalize;
`

export const UnitWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
`

export const TitleWrapper = styled.span`
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
`

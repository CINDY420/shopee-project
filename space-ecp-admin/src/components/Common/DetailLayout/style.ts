import styled from 'styled-components'
import { Layout } from 'infrad'

export const StyledLayout = styled(Layout)`
  height: 100%;
`
export const Header = styled.div`
  background-color: #ffffff;
  padding: 16px 24px 0 24px;
`

export const TitleWrapper = styled.div<{ hasBreadCrumb: boolean }>`
  margin-top: ${(props) => (props.hasBreadCrumb ? '16px' : 0)};
`

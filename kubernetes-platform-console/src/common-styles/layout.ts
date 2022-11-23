import styled from 'styled-components'
import { Layout } from 'infrad'

const { Content, Sider } = Layout

export const CommonStyledLayout = styled(Layout)`
  width: 100%;
  height: 100%;
  background-color: inherit;
`

export const CommonStyledSider = styled(Sider)`
  height: 100%;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(74, 74, 78, 0.16);
  /* overflow: auto; */
`

interface ICommonStyledContent {
  padding?: string
}

export const CommonStyledContent = styled(Content)<ICommonStyledContent>`
  width: 100%;
  height: 100%;
  padding: ${props => props?.padding || '0 32px'};
  overflow: hidden;
`

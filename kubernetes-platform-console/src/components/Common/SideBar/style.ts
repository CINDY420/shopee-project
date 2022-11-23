import { Layout } from 'infrad'
import styled from 'styled-components'

const { Sider } = Layout

export const StyledSider = styled(Sider)`
  .ant-layout-sider-trigger {
    position: relative;
  }
`

export const CollapseWrapper = styled.div`
  background-color: #fafafa;
  text-align: left;
  padding: 0 16px;
`

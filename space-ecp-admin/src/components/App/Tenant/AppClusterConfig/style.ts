import styled from 'styled-components'
import { AppClusterConfig } from 'src/components/App/Tenant/AppClusterConfig/index'
import { ContentWrapper } from 'src/common-styles/layout'
import { ifPropsTruthy } from 'src/helpers/styleMixins'

export const StyledAppClusterConfig = styled(AppClusterConfig)`
  > .ant-tabs-nav {
    margin-bottom: 0;

    .ant-tabs-nav-wrap .ant-tabs-nav-list > .ant-tabs-tab + .ant-tabs-tab {
      margin-left: 4px;
    }
  }
`

export const WhiteContentWrapper = styled(ContentWrapper)<{
  $noPaddingBottom?: boolean
}>`
  background-color: #fff;

  ${(props) => ifPropsTruthy(props, '$noPaddingBottom')`
    padding-bottom: 0;
  `}
`

import styled, { css } from 'styled-components'
import { Empty } from 'infrad'
import { DefaultConfig } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/index'
import { resetCSS } from 'src/helpers/styleMixins'

export const StyledDefaultConfig = styled(DefaultConfig)`
  ${() => resetCSS}

  .ant-tabs-tab {
    padding: 0;
    color: rgba(0, 0, 0, 0.85);

    &.ant-tabs-tab-active {
      color: #1890ff;
    }
  }

  .ant-tabs-nav::before {
    display: none;
  }

  .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    display: none;
  }
`

export const StyledSpan = styled.span<{
  $isActive: boolean
}>`
  ${(props) =>
    props.$isActive
      ? css`
          color: #1890ff;
        `
      : css`
          color: rgba(0, 0, 0, 0.25);
        `}
`

export const StyleEmpty = styled(Empty)`
  height: calc(100vh - 347px);
  padding-top: calc((100vh - 468px) / 2);
`

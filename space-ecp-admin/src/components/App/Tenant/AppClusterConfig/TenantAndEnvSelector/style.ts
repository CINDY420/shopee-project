import styled from 'styled-components'
import { TenantAndEnvSelector } from 'src/components/App/Tenant/AppClusterConfig/TenantAndEnvSelector/index'
import { Form } from 'infrad'
import { ifPropsDefined, resetCSS } from 'src/helpers/styleMixins'

export const StyledTenantAndEnvSelector = styled(TenantAndEnvSelector)`
  ${() => resetCSS()}
`

export const StyledFormItem = styled(Form.Item)<{
  $width?: string
  $isMovedRight?: boolean
  $isFontBold?: boolean
}>`
  ${(props) => ifPropsDefined(props, '$width')`
    .ant-form-item-control {
      width: ${props.$width};
    }
  `}
`

import styled from 'styled-components'
import { resetCSS } from 'src/helpers/styleMixins'
import { ApplicationConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ApplicationConfigForm/index'

export const StyledApplicationConfigForm = styled(ApplicationConfigForm)`
  ${() => resetCSS()}
`

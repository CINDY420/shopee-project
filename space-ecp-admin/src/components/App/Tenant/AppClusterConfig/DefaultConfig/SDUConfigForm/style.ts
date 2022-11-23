import styled from 'styled-components'
import { resetCSS } from 'src/helpers/styleMixins'
import { SDUConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/SDUConfigForm/index'

export const StyledSDUConfigForm = styled(SDUConfigForm)`
  ${() => resetCSS()}
`

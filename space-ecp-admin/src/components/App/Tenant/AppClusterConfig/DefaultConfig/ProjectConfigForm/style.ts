import styled from 'styled-components'
import { resetCSS } from 'src/helpers/styleMixins'
import { ProjectConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ProjectConfigForm/index'

export const StyledProjectConfigForm = styled(ProjectConfigForm)`
  ${() => resetCSS()}
`

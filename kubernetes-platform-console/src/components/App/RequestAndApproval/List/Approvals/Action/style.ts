import { Button } from 'infrad'
import styled from 'styled-components'

export const ActionButton = styled(Button)`
  width: ${props => (props.size === 'large' ? '160px' : 'unset')};
  margin: ${props => (props.size === 'large' ? '48px 24px' : '2px 0')};
`

export const StyledAuditResponseDiv = styled.div`
  color: #999999;
  margin: 5px 0;
`

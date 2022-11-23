import styled from 'styled-components'
import { Alert } from 'infrad'

export const StyledAlert: any = styled(Alert)`
  border-radius: 4px;
  margin-top: 12px;

  .ant-alert-message {
    margin-bottom: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

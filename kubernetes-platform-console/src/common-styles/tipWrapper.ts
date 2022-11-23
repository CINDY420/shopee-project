import styled from 'styled-components'
import { Alert } from 'infrad'

export const ErrorTip: any = styled(Alert)`
  margin-top: 0.7em;

  .ant-alert-message,
  .ant-alert-description {
    display: inline-block;
    margin-right: 1em;
  }
`

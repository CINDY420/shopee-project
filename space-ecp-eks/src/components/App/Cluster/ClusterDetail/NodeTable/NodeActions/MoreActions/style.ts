import styled from 'styled-components'
import { Descriptions, Alert } from 'infrad'

export const SelectedNodeWrapper = styled.div`
  height: 32px;
  margin-top: 24px;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
`

export const StyledDescription = styled(Descriptions)`
  background-color: #fafafa;
  padding-left: 16px;
  padding-top: 16px;
  margin-top: 24px;
`
export const StyledAlert = styled(Alert)`
  align-items: baseline;
  padding-bottom: 0px;
`

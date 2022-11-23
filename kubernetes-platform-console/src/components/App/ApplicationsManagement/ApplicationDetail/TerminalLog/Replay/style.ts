import styled from 'styled-components'

import { Input, Button, Typography } from 'infrad'

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`
export const Filters = styled.div`
  width: 100%;
  display: flex;
  margin-top: 24px;
  margin-bottom: 24px;
`
export const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledInput = styled(Input)`
  width: 480px;
  margin-right: 14px;
`

export const StyledButton = styled(Button)`
  padding: 0;
`
export const Text = styled(Typography.Text)`
  margin-bottom: 4px;
`
export const IPText = styled(Typography.Text)`
  margin-top: 4px;
  padding: 0px;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
`

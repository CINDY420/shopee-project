import styled from 'styled-components'
import { Button, Input } from 'infrad'

export const StyledButton: any = styled(Button)`
  height: 32px;
  padding-left: 24px;
  padding-right: 24px;
  font-size: 14px;
  line-height: 22px;
  margin-left: 24px;
`

export const Title = styled.div`
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 46px;
  font-weight: 500;
`

export const Filters = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`

export const UserTypeFilterWrapper = styled.div`
  margin-right: 24px;
  margin-bottom: 24px;
  margin-top: 22px;
`

export const StyledInput = styled(Input)`
  width: 480px;
`

import styled from 'styled-components'
import { Tag, Button } from 'infrad'

export const StyledImg = styled.img`
  vertical-align: text-bottom;
  width: 16px;
`
export const StyledTag = styled(Tag)`
  padding: 6px 12px;
  background-color: #eff3f7;
  border-radius: 20px;
  border: none;

  & span {
    margin-left: 6px;
  }
`

export const StyledButton: any = styled(Button)`
  padding: 0;
`

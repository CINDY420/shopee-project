import styled from 'styled-components'
import { Input, Button, Tag } from 'infrad'

export const UserTypeRadioGroup = styled.div`
  margin-right: 10px;
`
export const StyledInput = styled(Input)`
  width: 320px;
  height: 32px;
`
interface IStyledButtonProps {
  width?: string
}

export const StyledButton = styled(Button)<IStyledButtonProps>`
  padding: 0;
  width: ${(props: IStyledButtonProps) => props.width};
`
interface IStyledTagProps {
  type: string
}

export const StyledTag = styled(Tag)<IStyledTagProps>`
  padding: 6px 12px;
  background-color: ${(props: IStyledTagProps) => (props?.type === 'Bot' ? '#F9F0FF' : '#F6F9FE')};
  border-radius: 20px;
  border: none;

  & span {
    margin-left: 6px;
  }
`
export const StyledImg = styled.img`
  vertical-align: text-bottom;
  width: 16px;
`

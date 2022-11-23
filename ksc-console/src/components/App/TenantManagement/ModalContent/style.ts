import styled from 'styled-components'
import { Input } from 'infrad'

export const ContentWrapper = styled.div`
  padding: 0 24px;
`

interface IStyledInputProps {
  width: string
}

export const StyledInput = styled(Input)<IStyledInputProps>`
  width: ${(props: IStyledInputProps) => props.width}}
  margin:0;

  .ant-input[disabled] {
    color: #000000;
  }
}
`

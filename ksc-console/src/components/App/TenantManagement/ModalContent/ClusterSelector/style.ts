import styled from 'styled-components'
import { Input } from 'infrad'

interface IStyledInputProps {
  width: string
}

export const StyledInput = styled(Input)<IStyledInputProps>`
  width: ${(props: IStyledInputProps) => props.width}}
  margin:0;
`
export const QuotaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const QuotaItemWrapper = styled.div`
  width: 164px;
  height: 32px;
  margin-right: 16px;
  display: flex;
  flex-direction: row;
  border: solid 1px #d8d8d8;
  &:last-child {
    margin-right: 0;
  }
`

export const QuotaName = styled.div`
  background-color: #f6f6f6;
  font-size: 14px;
  line-height: 16px;
  border-right: solid 1px #d8d8d8;
  padding: 8px 12px;
`

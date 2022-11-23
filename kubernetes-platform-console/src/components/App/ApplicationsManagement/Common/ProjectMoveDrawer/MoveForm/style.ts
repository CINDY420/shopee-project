import styled from 'styled-components'

interface INameProps {
  disabled: boolean
}

export const OptionName = styled.div<INameProps>`
  font-size: 14px;
  color: ${props => (props.disabled ? '#999999' : '#333333')};
`

export const OptionId = styled.div`
  font-size: 12px;
  color: #999999;
`

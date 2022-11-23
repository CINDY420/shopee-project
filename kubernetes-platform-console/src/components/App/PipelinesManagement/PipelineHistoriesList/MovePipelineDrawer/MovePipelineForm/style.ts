import styled from 'styled-components'

import { Select } from 'infrad'

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

export const StyledSelect = styled(Select)`
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: transparent;
    font-weight: 400;

    ${OptionName} {
      color: #2673dd;
    }
  }
`

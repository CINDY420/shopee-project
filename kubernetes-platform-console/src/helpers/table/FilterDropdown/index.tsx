import * as React from 'react'
import { Input, Button } from 'infrad'
import styled from 'styled-components'
import { SearchOutlined } from 'infra-design-icons'

interface IFilterDropdownProps {
  /** Search value */
  value: string
  /** Callback of search value change event */
  onChange: (event: any) => void
  /** Callback of search btn click event */
  onSearch: () => void
  /** Callback of reset btn click event */
  onReset: () => void
  /** Get search input box ref */
  inputRef?: (node) => void
}

const StyledInput = styled(Input)`
  width: 188px;
  margin-bottom: 8px;
  display: block;
`

const StyledSearchButton = styled(Button)`
  width: 90px;
  margin-right: 8px;

  .anticon {
    position: initial !important;
    transform: translate(0, 0);
  }
`

const StyledResetButton = styled(Button)`
  width: 90px;
`

const FilterDropdown: React.FC<IFilterDropdownProps> = props => {
  const { value, onChange, onSearch, onReset, inputRef } = props

  return (
    <div style={{ padding: 8 }}>
      <StyledInput
        placeholder='Search'
        value={value}
        onChange={event => onChange(event)}
        onPressEnter={onSearch}
        ref={inputRef}
      />
      <StyledSearchButton type='primary' onClick={onSearch} icon={<SearchOutlined />} size='small'>
        Search
      </StyledSearchButton>
      <StyledResetButton onClick={onReset} size='small'>
        Reset
      </StyledResetButton>
    </div>
  )
}

export default FilterDropdown

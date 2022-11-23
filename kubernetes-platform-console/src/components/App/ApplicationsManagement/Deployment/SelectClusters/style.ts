import styled from 'styled-components'
import { Select } from 'infrad'

export const StyledSelect = styled(Select)`
  flex: 1;
`

export const SelectWrapper = styled.div`
  min-width: 20em;
  display: flex;
  align-items: center;
  margin-left: 1em;

  > span {
    margin-right: 0.3em;
  }
`

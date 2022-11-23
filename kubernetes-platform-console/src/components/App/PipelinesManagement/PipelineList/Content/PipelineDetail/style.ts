import styled from 'styled-components'

import { Input, Select, Button } from 'infrad'

export const ActionHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const SearchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1 0 auto;
  max-width: 100%;
`

export const FilterSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 24px;
`

export const FilterSelect = styled(Select)`
  width: 100%;
  margin-left: 8px;
`

export const FilterInput = styled(Input)`
  width: 100%;
  margin-left: 8px;
`

export const StyledButton: any = styled(Button)`
  font-weight: 500;

  & + & {
    margin-left: 16px;
  }
`

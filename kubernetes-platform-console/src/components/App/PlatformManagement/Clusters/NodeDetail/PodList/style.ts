import styled from 'styled-components'
import { Card, Input } from 'infrad'

export const PodListWrapper = styled(Card)`
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
`

export const Title = styled.div`
  color: #333;
  font-size: 22px;
  font-weight: 600;
`

export const SearchRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
`

export const StyledInput = styled(Input)`
  width: 480px;
`

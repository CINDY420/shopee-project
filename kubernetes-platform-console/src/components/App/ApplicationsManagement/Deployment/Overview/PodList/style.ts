import styled from 'styled-components'
import { Card, Input } from 'infrad'

export const PodListWrapper = styled(Card)`
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
`

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 48px;
`

export const Title = styled.div`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
`

export const SearchRow = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledInput = styled(Input)`
  width: 480px;
  height: 32px;
  margin-right: 16px;
`

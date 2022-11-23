import styled from 'styled-components'
import { Input } from 'infrad'

export const Root = styled.div`
  position: relative;
  height: 100%;
`
export const HeaderWrapper = styled.div`
  overflow: auto;
`

export const SearchInput = styled(Input.Search)`
  width: 240px;
  float: right;
`

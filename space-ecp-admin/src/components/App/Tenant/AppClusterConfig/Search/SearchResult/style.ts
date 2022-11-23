import styled from 'styled-components'
import { Empty } from 'infrad'
import { SearchResult } from 'src/components/App/Tenant/AppClusterConfig/Search/SearchResult'
import { resetCSS } from 'src/helpers/styleMixins'

export const StyledSearchResult = styled(SearchResult)`
  padding: 12px 16px 16px;
  min-height: 422px;
  background-color: #fafafa;
  border-radius: 2px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);

  > p[role='result-title'] {
    margin-bottom: 16px;
  }

  ${() => resetCSS()}
`

export const StyleEmpty = styled(Empty)`
  height: 455px;
  padding-top: calc((455px - 122px) / 2);
`

export const StyledResultBox = styled.div`
  height: calc(100vh - 405px);
  overflow-y: scroll;
`

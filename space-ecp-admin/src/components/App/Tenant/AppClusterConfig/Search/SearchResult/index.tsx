import { FunctionComponent } from 'react'
import {
  StyledResultBox,
  StyleEmpty,
} from 'src/components/App/Tenant/AppClusterConfig/Search/SearchResult/style'
import { StyledSearchResultItem } from 'src/components/App/Tenant/AppClusterConfig/Search/SearchResult/SearchResultItem/style'
import { ClusterResult } from 'src/components/App/Tenant/AppClusterConfig/Search'

type SearchResultProp = {
  className?: string
  resultItems: ClusterResult[]
}
export const SearchResult: FunctionComponent<SearchResultProp> = (props) => {
  const { className, resultItems } = props
  const total = resultItems.reduce((total, item) => total + item.clusters.length, 0)

  if (!total) {
    return (
      <div className={className}>
        <StyleEmpty />
      </div>
    )
  }

  return (
    <div className={className}>
      <p role="result-title">Result:</p>
      <StyledResultBox>
        {resultItems.map((item) => (
          <StyledSearchResultItem key={item.scope} title={item.scope} results={item.clusters} />
        ))}
      </StyledResultBox>
    </div>
  )
}

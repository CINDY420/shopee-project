import { FunctionComponent } from 'react'
import { Divider, Tag } from 'infrad'
import { ClusterResult } from 'src/components/App/Tenant/AppClusterConfig/Search'

type SearchResultItemProp = {
  className?: string
  title: string
  results: ClusterResult['clusters']
}
export const SearchResultItem: FunctionComponent<SearchResultItemProp> = (props) => {
  const { className, title, results } = props

  return results.length ? (
    <div className={className}>
      <p>{title}</p>
      <Divider />
      {results.map((result) => (
        <Tag key={result.id} className="site-tag-plus">
          {result.name}
        </Tag>
      ))}
    </div>
  ) : (
    <></>
  )
}

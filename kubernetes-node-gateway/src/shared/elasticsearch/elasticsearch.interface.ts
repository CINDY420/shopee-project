import { SearchHit } from '@elastic/elasticsearch/api/types'

type HasSource<TDocument = unknown> = SearchHit<TDocument> & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _source: Exclude<SearchHit<TDocument>['_source'], undefined>
}

export function hasSource<TDocument>(hit: SearchHit<TDocument>): hit is HasSource<TDocument> {
  return '_source' in hit && hit._source !== undefined
}

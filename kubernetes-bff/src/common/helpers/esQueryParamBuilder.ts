import { IEsBooleanQuery } from 'common/interfaces'
import { ESIndex } from 'common/constants/es'

enum booleanQueryParamMapping {
  must = 'must',
  filter = 'filter',
  mustNot = 'must_not',
  should = 'should',
  minimumShouldMatch = 'minimum_should_match',
  boost = 'boost'
}
export const esBooleanQueryParamBuilder = (
  index: ESIndex | string,
  query: IEsBooleanQuery,
  size?: number,
  from?: number,
  sort?: string[]
) => {
  const bool = {}
  for (const key in query) {
    const boolKey = booleanQueryParamMapping[key]
    bool[boolKey] = query[key]
  }

  const result: any = {
    index,
    size,
    from,
    body: {
      query: {
        bool: bool
      }
    }
  }
  if (sort) {
    result.sort = sort
  }

  return result
}

/**
 *
 * @param field The fields to be queried.
 * @param value The value to be queried.
 */
export const esTermQueryBlockBuilder = (field: string, value: string) => ({
  term: {
    [field]: {
      value
    }
  }
})

/**
 *
 * @param queryBlocks es query block
 */
export const esBooleanMustQueryBlockBuilder = (queryBlocks: any[]) => ({
  must: queryBlocks
})

/**
 *
 * @param queryBlocks es query blocks
 */
export const esBooleanShouldQueryBlockBuilder = (queryBlocks: any[]) => ({
  should: queryBlocks
})

/**
 *
 * @param queryBlocksMap es query blocks map
 */
export const esBooleanQueryBlockBuilder = (
  queryBlocksMap: Partial<Record<'must' | 'filter' | 'should' | 'must_not', any>>
) => {
  const { must, filter, must_not, should } = queryBlocksMap

  const bool = {
    must,
    filter,
    must_not,
    should
  }

  Object.keys(bool).forEach((key) => bool[key] === undefined && delete bool[key])

  return {
    bool
  }
}

/**
 *
 * @param path path_to_nested_doc
 * @param query any es query block
 */
export const esNestedQueryBlockBuilder = (path: string, query: any) => ({
  nested: {
    path,
    query
  }
})

/**
 *
 * @param fields The fields to be queried.
 * @param queryText The query string.
 */
export const esMultiMatchQueryBlockBuilder = (fields: string[], queryText: string) => ({
  multi_match: {
    query: queryText,
    fields
  }
})

/**
 *
 * @param field The field to be queried
 * @param queryText The query string
 */
export const esMatchQueryBlockBuilder = (field: string, queryText: string) => ({
  match: {
    [field]: queryText
  }
})

export const esRegexpSearchBuilder = (value: string) => `[^.]*${value}.*`
export const esTerminalRegexpSearchBuilder = (value: string) => `.*${value}.*`

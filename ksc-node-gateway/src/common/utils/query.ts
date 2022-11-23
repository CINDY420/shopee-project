import { ListQuery } from '@/common/dtos/list.dto'
import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

// 解析filterBy数据  example: frontendFilterBy=status==Pending,status==Completed;type==pytorch
const transformFrontendListFilterByToOpenApiListFilterBy = (frontendFilterBy: string): string => {
  const filters = frontendFilterBy.split(';')
  return filters
    .map((filter) => {
      const filterValues = filter.split(',')
      return filterValues.reduce((filterValue, result) => {
        const [, value] = filterValue.split('==')
        return value ? `${result},${value}` : result
      })
    })
    .join(';')
}

/**
 * Transform frontend query to openapi query
 * 前端请求query规范: https://confluence.shopee.io/pages/viewpage.action?pageId=609075996#APIGuideline-orderBy
 * openApi请求query规范:
 * - offset: 同前端规范的offset
 * - limit: 同前端规范的limit
 * - filterBy: 同前端规范的filterBy。但只支持完全匹配，不支持keyPath， “filterBy=foo.bar==1”。
 * - sortBy: 同前端规范的orderBy。 key用“,”分开，例如“sortBy=created_time,name”。排序方式“desc”或“asc”，空格分开， 例如“created_time desc,name asc”。
 * - keyword: 同前端规范的searchBy，全局模糊搜索
 */

export const transformFrontendListQueryToOpenApiListQuery = (frontendQuery: ListQuery): OpenApiListQuery => {
  const { offset, limit, filterBy, orderBy, searchBy } = frontendQuery
  return {
    offset,
    limit,
    filterBy: filterBy ? transformFrontendListFilterByToOpenApiListFilterBy(filterBy) : undefined,
    sortBy: orderBy,
    keyword: searchBy,
  }
}

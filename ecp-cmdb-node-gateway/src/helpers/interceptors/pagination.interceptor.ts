import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { IPaginationContext } from '@/helpers/interfaces/pagination'
import { FILTER_TYPE, ListQuery } from '@/helpers/models/list-query.dto'

/**
 * @example
 * @Get('tickets')
 * // set this controller metadata
 * @Pagination({
 *   key: 'items',
 *   countKey: 'total',
 *   defaultOrder: 'metaInfo.createTime',
 *   canPaginationFilter: false,
 *  })
 * @UseInterceptors(PaginateInterceptor)
 * async listCluster() {
 *  // your code
 * }
 */
@Injectable()
export class PaginateInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const paginationContext: IPaginationContext = this.reflector.get(
      'pagination',
      context.getHandler(),
    )

    const {
      key,
      countKey,
      defaultOrder,
      canPaginationFilter,
      canPaginationSearch,
      operationAfterInterceptor,
    } = paginationContext

    const query: ListQuery = context.switchToHttp().getRequest().query
    const { filterBy, searchBy, offset = 0, limit = 10 } = query
    const orderBy = query.orderBy ?? defaultOrder

    const filterList = ListQuery.parseFilterBy(filterBy)
    const searchByList = ListQuery.parseFilterBy(searchBy)
    return next.handle().pipe(
      // search
      map((data) => {
        const sources = data[key]
        const total = data[countKey]
        if (!searchBy || !canPaginationSearch) {
          return {
            ...data,
            [key]: sources,
            [countKey]: total,
          }
        }
        const newSources = ListQuery.getFilteredData(FILTER_TYPE.SEARCH_BY, searchByList, sources)
        return {
          ...data,
          [key]: newSources,
          [countKey]: newSources.length,
        }
      }),

      // filter
      map((data) => {
        const sources = data[key]
        const total = data[countKey]
        if (!canPaginationFilter) {
          return {
            ...data,
            [key]: sources,
            [countKey]: total,
          }
        }
        const newSources = ListQuery.getFilteredData(FILTER_TYPE.FILTER_BY, filterList, sources)
        return {
          ...data,
          [key]: newSources,
          [countKey]: newSources.length,
        }
      }),

      // sort
      map((data) => {
        const sources = data[key]
        const newSources = orderBy ? sources.sort(ListQuery.getCompareFunction(orderBy)) : sources
        return {
          ...data,
          [key]: newSources,
        }
      }),

      // operation after filter
      map((data) => {
        if (operationAfterInterceptor) {
          const extraProps = operationAfterInterceptor(data)
          return {
            ...data,
            ...extraProps,
          }
        }
        return data
      }),

      // paging
      map((data) => {
        const sources = data[key]
        const start = offset
        const end = Number(start) + Number(limit)

        const newSources = sources.slice(start, end)

        return {
          ...data,
          [key]: newSources,
        }
      }),
    )
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { IPaginationContext } from '@/interfaces/pagination'

/**
 * @example
 * @Get('tickets')
 * // set this controller metadata
 * @Pagination({
 *   key: 'items',
 *   countKey: 'total',
 *   defaultOrder: 'metaInfo.createTime',
 *   filterable: false,
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

    const { key, countKey, defaultOrder, filterable, searchable } = paginationContext

    const query: ListQuery = context.switchToHttp().getRequest().query
    const { filterBy, searchBy, offset = '0', limit = '10' } = query
    const orderBy = query.orderBy ?? defaultOrder

    const filterList = ListQuery.parseFilterBy(filterBy)
    const searchByList = ListQuery.parseFilterBy(searchBy)
    return next.handle().pipe(
      // search
      map((data) => {
        const sources = data[key]
        const total = data[countKey]
        if (!searchBy || !searchable) {
          return {
            ...data,
            [key]: sources,
            [countKey]: total,
          }
        }
        const newSources = ListQuery.getFilteredData(searchByList, sources)
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
        if (!filterable) {
          return {
            ...data,
            [key]: sources,
            [countKey]: total,
          }
        }
        const newSources = ListQuery.getFilteredData(filterList, sources)
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

      // paging
      map((data) => {
        const sources = data[key]
        const start = Number(offset)
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

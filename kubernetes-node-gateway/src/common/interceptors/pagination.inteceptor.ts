import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { IPaginationContext } from '@/common/interfaces/pagination'

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
    const paginationContext: IPaginationContext = this.reflector.get('pagination', context.getHandler())

    const { key, countKey, defaultOrder, canPaginationFilter } = paginationContext

    const query: ListQuery = context.switchToHttp().getRequest().query
    const { filterBy, offset = '0', limit = '10' } = query
    const orderBy = query.orderBy ?? defaultOrder

    const filterList = ListQuery.parseFilterBy(filterBy)
    return next.handle().pipe(
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

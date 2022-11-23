import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ListQueryDto } from 'common/dtos'
import { ERROR_MESSAGE } from 'common/constants/error'

import { isPaginateParamsCorrect } from 'common/helpers/paginate'
import { filterHandler, generateSortHandler, parseFilters } from 'common/helpers/filter'

/**
 * @example
 * @Get('clusters')
 * // set this controller metadata
 * @Pagination({
 *   key: 'clusters',
 *   countKey: 'totalCount'
 *  })
 * @UseInterceptors(PaginateInterceptor)
 * async listCluster() {
 *  // your code
 * }
 */
const throwError = () => {
  throw new HttpException(
    'List paginate param error! Please check the type of filterBy, orderBy, offset and limit',
    HttpStatus.BAD_REQUEST
  )
}

@Injectable()
export class PaginateInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const paginationContext = this.reflector.get('pagination', context.getHandler())

    const { key, countKey, defaultOrder } = paginationContext

    const query: ListQueryDto = context.switchToHttp().getRequest().query

    const { filterBy = '', offset = 0, limit = 10 } = query

    const orderBy = !query.orderBy ? defaultOrder || '' : query.orderBy

    if (!isPaginateParamsCorrect(query)) {
      throwError()
    }

    if (offset < 0) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_OFFSET_INVALID)
    }

    if (limit <= 0) {
      throw new BadRequestException(ERROR_MESSAGE.REQUEST_LIMIT_INVALID)
    }

    let filterList = []
    try {
      filterList = parseFilters(filterBy)
    } catch (err) {
      throwError()
    }

    return next.handle().pipe(
      // filter
      map((data) => {
        const sources = data[key]
        const newSources = filterHandler(filterList, sources)
        return {
          ...data,
          [key]: newSources,
          [countKey]: newSources.length
        }
      }),

      // sort
      map((data) => {
        const sources = data[key]
        const sortHandler = generateSortHandler(orderBy)
        return {
          ...data,
          [key]: sources.sort(sortHandler)
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
          [key]: newSources
        }
      })
    )
  }
}

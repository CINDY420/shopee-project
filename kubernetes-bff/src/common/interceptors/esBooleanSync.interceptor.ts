import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException
} from '@nestjs/common'
import { interval, Observable } from 'rxjs'
import { catchError, first, map, mergeMap, timeout } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ESService } from 'common/modules/es/es.service'
import { cloneDeep } from 'lodash'

@Injectable()
export class EsBooleanSyncInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector, private esService: ESService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const esBooleanSyncContext = this.reflector.get('esBooleanSync', context.getHandler())

    const { esIndex, esBooleanQueryItems, operation, validator, secondEsIndex } = esBooleanSyncContext

    const must = []

    esBooleanQueryItems.forEach((queryItem) => {
      const { queryKey, dataIndex, position } = queryItem
      const value = context.switchToHttp().getRequest()[position][dataIndex]
      must.push({
        term: { [queryKey]: value }
      })
    })

    const booleanQueryParam = { must: must }

    const searchData = async (data) => {
      const esData = await this.esService.booleanQueryFirst(esIndex, booleanQueryParam)

      if (typeof validator === 'function') {
        if (secondEsIndex) {
          const esDataSecond = await this.esService.booleanQueryFirst(secondEsIndex, booleanQueryParam)
          return validator(cloneDeep(data), esData, esDataSecond)
        } else {
          return validator(cloneDeep(data), esData)
        }
      }

      return operation === 'create' ? esData !== null : esData === null
    }

    return next.handle().pipe(
      mergeMap((response) =>
        interval(500).pipe(
          mergeMap(() => searchData(response)),
          first((data) => data === true),
          map(() => response),
          timeout(30000),
          catchError((error) => {
            throw new InternalServerErrorException(error)
          })
        )
      )
    )
  }
}

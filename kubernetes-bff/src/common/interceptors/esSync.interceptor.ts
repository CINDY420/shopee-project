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
export class EsSyncInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector, private esService: ESService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const esSyncContext = this.reflector.get('esSync', context.getHandler())

    const { esContext, reqContext, operation, validator } = esSyncContext

    const { position, key } = reqContext

    const value = context.switchToHttp().getRequest()[position][key]

    const searchData = async (data) => {
      const { index, key } = esContext
      const esData = await this.esService.termQueryFirst(index, key, value)

      if (typeof validator === 'function') {
        return validator(cloneDeep(data), esData)
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

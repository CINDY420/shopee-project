import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { map } from 'rxjs/operators'

export interface IWrappedResponse<TData> {
  data: TData
  code: number
  message: string
  status: number
}

@Injectable()
export class WrapResponseInterceptor<TOriginalResponseBody>
  implements NestInterceptor<TOriginalResponseBody, IWrappedResponse<TOriginalResponseBody>>
{
  intercept(context: ExecutionContext, next: CallHandler<TOriginalResponseBody>) {
    return next.handle().pipe(
      map((data) => ({
        data,
        code: 0,
        message: 'ok',
        status: HttpStatus.OK,
      })),
    )
  }
}

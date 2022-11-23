import { RequestContext } from '@medibloc/nestjs-request-context'

export class CommonRequestContext extends RequestContext {
  requestId: string
}

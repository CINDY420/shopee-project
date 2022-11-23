/**
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=644068169#heading-11Createticket
 */

export class CreateShopeeTicketParams<TFormType = unknown> {
  title: string
  processDefinitionIdOrKey: string
  formVariables: Record<string, string | number> & TFormType
  customAssignee?: Record<string, string | string[]>
  processVariables?: Record<string, unknown>
  watchers?: string[]
  eventCallback?: {
    callbackUrl: string
    headers?: Record<string, string>
    retryTimes?: number
    events: string[]
  }
}

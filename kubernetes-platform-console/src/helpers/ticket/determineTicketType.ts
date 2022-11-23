import { IElasticsearchTicketExtraInfo, IShopeeScaleDeploymentTicketExtraInfo, ITicket } from 'swagger-api/v1/models'

export const isShopeeScaleDeploymentTicket = (
  extraInfo: ITicket['extraInfo']
): extraInfo is IShopeeScaleDeploymentTicketExtraInfo => {
  return 'variables' in extraInfo
}

export const isElasticsearchTicket = (extraInfo: ITicket['extraInfo']): extraInfo is IElasticsearchTicketExtraInfo => {
  return 'tenantId' in extraInfo
}

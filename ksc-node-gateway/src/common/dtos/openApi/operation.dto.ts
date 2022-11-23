import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

export class OpenApiListOperationRecordsQuery extends OpenApiListQuery {
  startTime?: number
  endTime?: number
}

class ListOperationRecordsItem {
  operationRecordId: string
  category: string
  description: string
  operation: string
  operationTime: string
  operator: string
}

export class ListOperationRecordsResponse {
  total: string
  items: ListOperationRecordsItem[]
}

export class GetOperationRecordResponse {
  operationRecordId: string
  category: string
  description: string
  operation: string
  operationTime: string
  operator: string
  tenantId: string
  projectId: string
  action: string
  url: string
  payload: string
  originPayload: string
}

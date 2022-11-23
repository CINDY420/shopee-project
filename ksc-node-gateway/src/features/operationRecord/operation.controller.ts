import { Controller, Get, Param, Query } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { ApiTags } from '@nestjs/swagger'
import { GetOperationRecordParams, ListOperationRecordsQuery } from '@/features/operationRecord/dto/operation.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'

@ApiTags('Operation')
@Controller()
export class OperationController {
  constructor(private readonly openApiService: OpenApiService) {}
  @Get('operationRecords')
  listOperationRecords(@Query() listOperationRecordsQuery: ListOperationRecordsQuery) {
    const { offset, limit, filterBy, searchBy, orderBy, ...rest } = listOperationRecordsQuery
    const openApiListJobsQuery = transformFrontendListQueryToOpenApiListQuery({
      offset,
      limit,
      filterBy,
      searchBy,
      orderBy,
    })
    return this.openApiService.listOperationRecords({ ...openApiListJobsQuery, ...rest })
  }

  @Get('operationRecords/:operationRecordId')
  getOperationRecord(@Param() getOperationRecordParams: GetOperationRecordParams) {
    const { operationRecordId } = getOperationRecordParams
    return this.openApiService.getOperationRecord(operationRecordId)
  }
}

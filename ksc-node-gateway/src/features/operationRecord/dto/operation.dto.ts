import { IsNotEmpty, IsString } from 'class-validator'
import { ListQuery } from '@/common/dtos/list.dto'

class BasicParams {
  @IsNotEmpty()
  @IsString()
  operationRecordId: string
}

export class ListOperationRecordsQuery extends ListQuery {
  startTime?: number
  endTime?: number
}

export class GetOperationRecordParams extends BasicParams {}

import { IsNotEmpty, IsString } from 'class-validator'
import { ListQuery } from '@/common/dtos/list.dto'

export class ListPeriodicJobsQuery extends ListQuery {}
export class ListPeriodicJobInstancesQuery extends ListQuery {}

class BasicParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}

export class ListPeriodicJobsParams extends BasicParams {}

export class ListPeriodicJobInstancesParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}

export class GetPeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}

export class DeletePeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}
export class RerunPeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}
export class KillPeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}
export class EnablePeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}
export class BatchHandlePeriodicJobParams extends BasicParams {}
export class CreatePeriodicJobParams extends BasicParams {}
export class UpdatePeriodicJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  periodicJobId: string
}

export class KillJobBody {
  jobId: string
}
export class RerunJobBody {
  jobId: string
}

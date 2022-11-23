import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator'
import { HPAWithId, HpaMeta, HpaSpec } from '@/features/hpa/entities/hpa.entity'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { Type } from 'class-transformer'

export class CreateHpaParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string
}

export class CreateHpaBody {
  @ValidateNested()
  @Type(() => HpaMeta)
  meta: HpaMeta

  @ValidateNested()
  @Type(() => HpaSpec)
  spec: HpaSpec
}

export class UpdateHpaParams extends CreateHpaParams {}

export class UpdateHpaBody {
  @ValidateNested()
  @Type(() => HpaMeta)
  meta: HpaMeta

  @ValidateNested()
  @Type(() => HpaSpec)
  spec: HpaSpec

  @IsNumber()
  id: number
}

export class BatchCopyHpaParams extends CreateHpaParams {}

export class DeploymentHpa {
  @ValidateNested()
  @Type(() => HpaMeta)
  meta: HpaMeta

  @ValidateNested()
  @Type(() => HpaSpec)
  spec: HpaSpec
}

export class BatchCopyHpaBody {
  @IsArray()
  deploymentsHpas: DeploymentHpa[]
}

export class BatchCopyHpaResponse {
  azSdu: HpaMeta
  errorMessage: string
}

export class ListHPARulesParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string
}

export class ListHPARulesQuery extends ListQuery {}

export class ListHPARulesResponse {
  lists: HPAWithId[]
  total: number
}

export class BatchEditHPARulesParams extends ListHPARulesParams {}

export class BatchEditHPARulesBody {
  @ValidateNested()
  @Type(() => HPAWithId)
  hpas: HPAWithId[]
}

export class GetHpaDetailParams extends ListHPARulesParams {}

export class GetHpaDetailQuery {
  @IsString()
  az: string

  @IsNotEmpty()
  @IsString()
  sdu: string
}

export class GetHpaDetailResponse extends HPAWithId {}

export class GetHpaDefaultConfigParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string
}

export class GetHpaDefaultConfigQuery extends GetHpaDetailQuery {}

export class GetHpaDefaultConfigResponse extends HpaSpec {}

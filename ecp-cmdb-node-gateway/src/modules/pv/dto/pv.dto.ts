import { ListQuery } from '@/helpers/models/list-query.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ListPVsParam {
  @IsNotEmpty()
  @IsString()
  serviceId: string
}

export class ListPVsQuery extends ListQuery {}

class PV {
  id: string
  uuid: string
  name: string
  serviceId: string
  project: string
  module: string
  env: string
  cid: string
  az: string
  secret: string
  accessMode: string
  subpath: string
  status: string
  updatedAt: string
}

export class ListPVsResponse {
  items: PV[]
  total: number
}

export class CreatePVParam {
  @IsNotEmpty()
  @IsString()
  serviceId: string
}

export class CreatePVBody {
  @IsString()
  serviceName: string

  @IsString()
  name: string

  @IsString()
  project: string

  @IsString()
  module: string

  @IsString()
  env: string

  @IsString()
  cid: string

  @IsString()
  az: string

  @IsString()
  secret: string

  @IsString()
  accessMode: string

  @IsString()
  subpath: string
}

export class RetryCreatePVParam extends CreatePVParam {
  @IsNotEmpty()
  @IsString()
  uuid: string
}

export class RetryCreatePVBody extends CreatePVBody {}

export class DeletePVParam {
  @IsNotEmpty()
  @IsString()
  uuid: string
}

export class ListPvSecretsParam {
  @IsNotEmpty()
  @IsString()
  serviceId: string
}

export class ListPvSecretsQuery extends ListQuery {}

class Secret {
  id: string
  serviceId: string
  serviceName: string
  uuid: string
  name: string
  project: string
  module: string
  env: string
  az: string
  ussAppid: string
  ussAppSecret: string
  intranetDomain: string
  updatedAt: string
}

export class ListPvSecretsResponse {
  items: Secret[]
  total: number
}

export class ListAllPvSecretsParam extends ListPvSecretsParam {}

export class ListAllPvSecretsQuery {
  @IsOptional()
  @IsString()
  filterBy?: string

  @IsOptional()
  @IsString()
  orderBy?: string
}

export class ListAllPvSecretsResponse extends ListPvSecretsResponse {}

export class CreatePvSecretParam {
  @IsNotEmpty()
  @IsString()
  serviceId: string
}

export class CreatePvSecretBody {
  @IsString()
  serviceName: string

  @IsString()
  name: string

  @IsString()
  project: string

  @IsString()
  module: string

  @IsString()
  env: string

  @IsString()
  az: string

  @IsString()
  ussAppid: string

  @IsString()
  ussAppSecret: string

  @IsString()
  intranetDomain: string
}

export class UpdatePvSecretParam extends CreatePvSecretParam {
  @IsNotEmpty()
  @IsString()
  uuid: string
}

export class UpdatePvSecretBody extends CreatePvSecretBody {}

export class DeletePvSecretParam {
  @IsNotEmpty()
  @IsString()
  uuid: string
}

export class CheckIsPvSecretExistParam extends CreatePvSecretParam {
  @IsNotEmpty()
  @IsString()
  ussAppid: string
}

export class CheckIsPvSecretExistBody {
  @IsString()
  env: string
}

export class CheckIsPvSecretExistResponse {
  exist: boolean
}

export class GetAllPvsParam extends ListPvSecretsParam {}

export class GetAllPvsResponse {
  allPvs: PV[]
}

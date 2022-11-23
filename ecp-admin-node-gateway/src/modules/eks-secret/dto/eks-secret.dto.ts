import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'

export class ListEksSecretsParam {
  // cluster数据库的id
  @IsNumberString()
  clusterId: string
}

export class ListEksSecretsQuery extends ListQuery {}

class EksSecret {
  secretName: string
  namespace: string
  type: string
  labels: string[]
  updateTime: string
}
export class ListEksSecretsResponse {
  items: EksSecret[]
  total: number
}

export class GetEksSecretParam extends ListEksSecretsParam {
  @IsString()
  secretName: string
}

export class GetEksSecretQuery {
  @IsNotEmpty()
  @IsString()
  namespace: string
}

class EksSecretDetail {
  secretKey: string
  secretValue: string
}
export class GetEksSecretResponse {
  secretName: string
  namespace: string
  type: string
  updateTime: string
  labels: string[]
  details: EksSecretDetail[]
}

export class ListAllNamespacesParam extends ListEksSecretsParam {}
export class ListAllNamespaceQuery {
  @IsOptional()
  @IsString()
  searchBy?: string
}
export class ListAllNamespacesResponse {
  items: string[]
}

export class ListAllTypesParam extends ListEksSecretsParam {}
export class ListAllTypesResponse {
  items: string[]
}

export class ListEksSecretDetailParam extends ListEksSecretsParam {
  @IsString()
  @IsNotEmpty()
  secretName: string
}

export class ListEksSecretDetailQuery extends ListQuery {
  @IsNotEmpty()
  @IsString()
  namespace: string
}

export class ListEksSecretDetailResponse {
  items: EksSecretDetail[]
  total: number
}

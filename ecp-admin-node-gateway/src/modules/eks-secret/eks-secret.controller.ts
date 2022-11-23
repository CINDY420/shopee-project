import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  ListEksSecretsParam,
  ListEksSecretsQuery,
  ListEksSecretsResponse,
  GetEksSecretParam,
  GetEksSecretQuery,
  GetEksSecretResponse,
  ListAllNamespacesParam,
  ListAllNamespaceQuery,
  ListAllNamespacesResponse,
  ListEksSecretDetailParam,
  ListEksSecretDetailQuery,
  ListEksSecretDetailResponse,
  ListAllTypesParam,
  ListAllTypesResponse,
} from '@/modules/eks-secret/dto/eks-secret.dto'
import { EksSecretService } from '@/modules/eks-secret/eks-secret.service'

@ApiTags('EksSecret')
@Controller('eks/clusters/:clusterId/secrets')
export class EksSecretController {
  constructor(private readonly eksSecretService: EksSecretService) {}

  @Get()
  listEksSecrets(
    @Param() param: ListEksSecretsParam,
    @Query() query: ListEksSecretsQuery,
  ): Promise<ListEksSecretsResponse> {
    return this.eksSecretService.listEksSecrets(param.clusterId, query)
  }

  @Get('namespaces')
  listAllNamespaces(
    @Param() param: ListAllNamespacesParam,
    @Query() query: ListAllNamespaceQuery,
  ): Promise<ListAllNamespacesResponse> {
    return this.eksSecretService.listAllNamespaces(param.clusterId, query?.searchBy)
  }

  @Get('types')
  listAllTypes(@Param() param: ListAllTypesParam): Promise<ListAllTypesResponse> {
    return this.eksSecretService.listAllTypes(param.clusterId)
  }

  @Get(':secretName')
  getEksSecret(
    @Param() param: GetEksSecretParam,
    @Query() query: GetEksSecretQuery,
  ): Promise<GetEksSecretResponse> {
    return this.eksSecretService.getEksSecret({
      clusterId: param.clusterId,
      namespace: query.namespace,
      secretName: param.secretName,
    })
  }

  @Get(':secretName/secretDetail')
  listEksSecretDetail(
    @Param() param: ListEksSecretDetailParam,
    @Query() query: ListEksSecretDetailQuery,
  ): Promise<ListEksSecretDetailResponse> {
    return this.eksSecretService.listEksSecretDetail(param, query)
  }
}

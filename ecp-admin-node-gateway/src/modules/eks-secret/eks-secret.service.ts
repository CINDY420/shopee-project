import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import {
  ListEksSecretsQuery,
  ListEksSecretsResponse,
  GetEksSecretResponse,
  ListEksSecretDetailParam,
  ListEksSecretDetailQuery,
  ListAllTypesResponse,
} from '@/modules/eks-secret/dto/eks-secret.dto'
import { listQuery } from '@infra/utils'

const { FilterByParser, FilterByOperator } = listQuery

@Injectable()
export class EksSecretService {
  constructor(private readonly eksApiService: EksApisService) {}

  async listEksSecrets(
    clusterId: string,
    query: ListEksSecretsQuery,
  ): Promise<ListEksSecretsResponse> {
    const { offset, limit, filterBy = '', searchBy } = query || {}
    const { pageSize, currentPage } = listQuery.offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })
    const filterByParser = new FilterByParser(filterBy)
    const keyValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)
    const { type = [], namespace = [] } = keyValuesMap || {}
    const secrets = await this.eksApiService.getApis().listSecrets(
      { id: Number(clusterId) },
      {
        pageNo: currentPage,
        pageSize,
        fuzzySearch: searchBy,
        namespace: namespace.length > 0 ? namespace[0] : undefined,
        fieldSelector: type.length > 0 ? `type==${type.join(',')}` : undefined,
      },
    )

    const { items, total = 0 } = secrets
    const formattedItems = items?.map(
      ({ secretname = '', namespace = '', type = '', labels = {}, creationtimestamp = '' }) => ({
        secretName: secretname,
        namespace,
        type,
        labels: Object.entries(labels).map(([key, value]) => `${key}=${value}`),
        updateTime: creationtimestamp,
      }),
    )

    return { items: formattedItems ?? [], total }
  }

  async getEksSecret(args: {
    clusterId: string
    namespace: string
    secretName: string
  }): Promise<GetEksSecretResponse> {
    const secret = await this.eksApiService
      .getApis()
      .getSecret(
        { id: Number(args.clusterId) },
        { namespace: args.namespace, secretname: args.secretName },
      )
    const {
      secretname = '',
      namespace = '',
      type = '',
      creationtimestamp = '',
      labels = {},
      items = [],
    } = secret
    return {
      secretName: secretname,
      namespace,
      type,
      updateTime: creationtimestamp,
      labels: Object.entries(labels).map(([key, value]) => `${key}=${value}`),
      details: items.map(({ secretkey = '', secretvalue = '' }) => ({
        secretKey: secretkey,
        secretValue: secretvalue,
      })),
    }
  }

  async listAllNamespaces(clusterId: string, searchBy = '') {
    const namespaces = await this.eksApiService
      .getApis()
      .listSecretsNamespaces({ id: Number(clusterId) }, { fuzzySearch: searchBy })
    const { items = [] } = namespaces
    return { items }
  }

  async listAllTypes(clusterId: string): Promise<ListAllTypesResponse> {
    const types = await this.eksApiService.getApis().listSecretsTypes({ id: Number(clusterId) })
    return { items: types?.items ?? [] }
  }

  async listEksSecretDetail(params: ListEksSecretDetailParam, query: ListEksSecretDetailQuery) {
    const { clusterId, secretName } = params
    const { namespace, offset, limit } = query
    const { offsetLimitToPagination } = listQuery

    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const data = await this.eksApiService
      .getApis()
      .getSecret(
        { id: Number(clusterId) },
        { namespace, secretname: secretName, pageNo: currentPage, pageSize },
      )
    const { total = 0, items = [] } = data
    const secretDetailList = items?.map((item) => {
      const { secretkey = '', secretvalue = '' } = item
      return {
        secretKey: secretkey,
        secretValue: secretvalue,
      }
    })
    return {
      items: secretDetailList,
      total,
    }
  }
}

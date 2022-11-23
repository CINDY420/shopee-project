import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'

import { ESIndex } from 'common/constants/es'

import { IEsIngresses } from './entities/ingress.entity'
import { GetClusterIngressesQueryDto, IngressListResponseDto } from './dto'
import {
  esBooleanQueryBlockBuilder,
  esBooleanShouldQueryBlockBuilder,
  esMatchQueryBlockBuilder,
  esMultiMatchQueryBlockBuilder,
  esNestedQueryBlockBuilder
} from 'common/helpers/esQueryParamBuilder'

@Injectable()
export class IngressesService {
  constructor(private eSService: ESService, private clustersService: ClustersService) {}

  async tree(): Promise<string[]> {
    const result = []

    const { buckets } = await this.eSService.aggregate(ESIndex.INGRESS_V3, 'cluster')
    buckets.forEach((bucket) => {
      if (bucket.doc_count > 0) result.push(bucket.key)
    })

    return result.sort()
  }

  async listClusterIngresses(
    clusterName: string,
    queryParams: GetClusterIngressesQueryDto
  ): Promise<IngressListResponseDto> {
    try {
      const { offset, limit, searchBy } = queryParams
      const searchValue = searchBy.split(':').join(' ')

      let ingresses = null
      if (!searchBy) {
        ingresses = await this.eSService.termQueryAll(ESIndex.INGRESS_V3, 'cluster', clusterName, limit, offset)
      } else {
        const ingressNameQuery = esMatchQueryBlockBuilder('name', searchValue)
        const ingressHostNameQuery = esNestedQueryBlockBuilder(
          'hosts',
          esMatchQueryBlockBuilder('hosts.name', searchValue)
        )
        const ingressHostPropertyQuery = esNestedQueryBlockBuilder(
          'hosts',
          esNestedQueryBlockBuilder(
            'hosts.paths',
            esMultiMatchQueryBlockBuilder(
              ['hosts.paths.servicePort', 'hosts.paths.pathType', 'hosts.paths.serviceName', 'hosts.paths.pathName'],
              searchValue
            )
          )
        )
        const clusterQuery = esMatchQueryBlockBuilder('cluster', clusterName)
        const ingressQuery = esBooleanQueryBlockBuilder({
          ...esBooleanShouldQueryBlockBuilder([ingressNameQuery, ingressHostNameQuery, ingressHostPropertyQuery])
        })

        ingresses = await this.eSService.booleanQueryAll<IEsIngresses>(
          ESIndex.INGRESS_V3,
          {
            must: [clusterQuery, ingressQuery]
          },
          limit,
          offset
        )
      }

      const { documents, total } = ingresses

      return {
        ingresses: documents.map((document) => {
          const { name, annotations, hosts } = document

          return {
            name,
            annotations,
            hosts
          }
        }),
        totalCount: total
      }
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}

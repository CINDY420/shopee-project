import { SpaceAZService } from '@/shared/space-az/space-az.service'
import { Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'
import { ListAllAzsResponse, ListAllSegmentNamesResponse } from '@/modules/global/dto/global.dto'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import { EnumType } from '@/constants/ecpApis'

@Injectable()
export class GlobalService {
  constructor(
    private readonly spaceAZService: SpaceAZService,
    private readonly ecpApisService: EcpApisService,
  ) {}

  async listEnumsByType(type: EnumType) {
    const allEnumsResponse = await this.ecpApisService.getFetch()['GET/ecpapi/v2/enums']()
    const { allenums = [] } = allEnumsResponse
    const filteredEnums = allenums.find((enumsItem) => enumsItem.type === type)
    return { items: filteredEnums?.enums || [] }
  }

  // AZ V2
  async listAllAzs(azKey?: string): Promise<ListAllAzsResponse> {
    const allAzsResponse = await this.spaceAZService
      .getFetch()
      ['GET/apis/az_meta/v1/az/query_azs']({ az_key: azKey })
    const result = allAzsResponse.result ?? []
    const formattedAzs = result.map(
      ({
        az_key: azKey,
        az_name: azName,
        compliance_type: complianceType,
        segments,
        statefulness,
        labels,
        region,
      }) => {
        const formattedSegments = segments.map(
          ({ segment_key: segmentKey, segment_name: segmentName }) => ({
            segmentKey,
            segmentName,
          }),
        )
        return {
          azKey,
          azName,
          complianceType,
          statefulness,
          labels: Object.entries(labels || {}).map(([key, value]) => `${key}: ${String(value)}`),
          region: region?.region_name,
          segments: formattedSegments,
        }
      },
    )
    const orderedAzs = formattedAzs.sort((currentItem, nextItem) =>
      currentItem.azName.localeCompare(nextItem.azName),
    )
    return { items: orderedAzs }
  }

  async listAllAZv1s() {
    const allAZv1sResponse = await this.spaceAZService
      .getFetch()
      ['GET/apis/envs/v2/az/list_names']()
    return { items: allAZv1sResponse?.result?.azs }
  }

  async listAzSegments(env?: string) {
    const spaceFetch = this.spaceAZService.getFetch()
    const ecpFetch = this.ecpApisService.getFetch()
    // az v1 + v2
    const azs = await ecpFetch['GET/ecpapi/v2/azs']({ env })
    const azsResult =
      azs.items?.map((azItem) => ({
        name: azItem.azKey ?? '',
        segmentKey: '',
        azKey: azItem.azKey ?? '',
      })) ?? []

    // az v2, which may have segments
    const QUERY_AZ_API_NAME = 'GET/apis/az_meta/v1/az/query_azs'
    const azV2DetailsResponse = await spaceFetch['GET/apis/az_meta/v1/az/query_azs']()
    const azSegmentResult = SpaceAZService.getResult(
      azV2DetailsResponse,
      QUERY_AZ_API_NAME,
    ).flatMap((azDetail) => {
      if (!azDetail.segments.length) {
        // some az has no segments
        return [
          {
            name: azDetail.az_key ?? '',
            segmentKey: '',
            azKey: azDetail.az_key,
          },
        ]
      }
      return azDetail.segments.map((segment) => ({
        name: `${azDetail.az_name}-${segment.segment_name}`,
        segmentKey: segment.segment_key,
        azKey: azDetail.az_key,
      }))
    })

    return uniqBy([...azsResult, ...azSegmentResult], (item) => item.name)
  }

  async listEnvs() {
    const GET_ENV_LIST_API_NAME = 'GET/apis/envs/v2/env/list'
    const response = await this.spaceAZService.getFetch()[GET_ENV_LIST_API_NAME]()
    return SpaceAZService.getResult(response, GET_ENV_LIST_API_NAME).map((env) => ({
      name: env.name,
      alias: env.alias_name,
      value: env.enum_value,
    }))
  }

  async listCIDs() {
    const GET_CID_LIST_API_NAME = 'GET/apis/envs/v2/cid/list'
    const response = await this.spaceAZService.getFetch()[GET_CID_LIST_API_NAME]()
    return SpaceAZService.getResult(response, GET_CID_LIST_API_NAME).map((cid) => ({
      name: cid.name,
      alias: cid.alias_name,
      value: cid.enum_value,
      visible: cid.visible,
    }))
  }

  async listAllSegmentNames(): Promise<ListAllSegmentNamesResponse> {
    const allAzsResponse = await this.spaceAZService
      .getFetch()
      ['GET/apis/az_meta/v1/az/query_azs']()

    // All segmentKey are different, but segmentName may be the same. Deduplicated segmentNames are needed.
    const segmentNameKeysMap: Record<string, string[]> = {}
    allAzsResponse.result.forEach((AZItem) => {
      AZItem.segments.forEach(({ segment_name: segmentName, segment_key: segmentKey }) => {
        if (!segmentNameKeysMap[segmentName]) segmentNameKeysMap[segmentName] = []
        // Deduplicate segmentKey
        if (!segmentNameKeysMap[segmentName].includes(segmentKey)) {
          segmentNameKeysMap[segmentName].push(segmentKey)
        }
      })
    })
    return {
      items: Object.entries(segmentNameKeysMap).map(([segmentName, segmentKeys]) => ({
        name: segmentName,
        segmentKeys,
      })),
    }
  }
}

import { Injectable } from '@nestjs/common'

import { ESService } from 'common/modules/es/es.service'
import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'

import { IESPolicy } from 'policy/entities/policy.entity'
import { ICreatePolicyDTO } from 'policy/dto/create.policy.dto'

const parseHits = (hits: any[]) => {
  return hits.map((hit) => {
    const { _id, _source } = hit
    return { id: _id, ..._source }
  })
}
@Injectable()
export class PolicyService {
  constructor(private readonly esService: ESService) {}

  async getPolicy(source: string, effectiveSourceId: string, roleId: number) {
    if (!effectiveSourceId || !roleId) {
      return {} as IESPolicy
    }
    const policy = await this.esService.booleanQueryAll<IESPolicy>(
      ESIndex.AUTH_POLICY,
      {
        must: [
          {
            term: { role: roleId }
          },
          {
            term: { effectiveSourceId }
          },
          {
            term: { source }
          }
        ]
      },
      ES_MAX_SEARCH_COUNT,
      0,
      [],
      parseHits
    )
    return policy.documents[0]
  }

  async addPolicy(body: ICreatePolicyDTO) {
    const policy = await this.getPolicy(body.source, body.effectiveSourceId, body.role)
    if (policy) {
      // policy is exist, update this policy
      const newPolicy = Object.assign(policy, body)
      newPolicy.updatedAt = new Date().toLocaleString()
      await this.updatePolicy(policy.id, Object.assign(policy, body))
      return newPolicy
    }
    const newPolicy: IESPolicy = {
      ...body,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    }
    const { result } = await this.esService.index(ESIndex.AUTH_POLICY, newPolicy)
    return result
  }

  async updatePolicy(id: string, body: ICreatePolicyDTO) {
    await this.esService.update(ESIndex.AUTH_POLICY, id, body)
  }

  async delPolicy(id: string) {
    await this.esService.delete(ESIndex.AUTH_POLICY, id)
  }

  async getPolicyList(size = 10, from = 0) {
    const { total, documents } = await this.esService.booleanQueryAll<IESPolicy>(
      ESIndex.AUTH_POLICY,
      {},
      size,
      from,
      [],
      parseHits
    )
    return {
      total,
      policyList: documents
    }
  }
}

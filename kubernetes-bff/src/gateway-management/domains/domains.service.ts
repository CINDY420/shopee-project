import { BadRequestException, Injectable } from '@nestjs/common'
import { ESIndex, ES_SUPER_MAX_SEARCH_COUNT } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'
import { countBy } from 'lodash'
import { IDomain, IDomainGroup } from './domains.entites'

@Injectable()
export class DomainsService {
  constructor(private esService: ESService) {}

  async getDomain(clusterName, domainName, searchBy) {
    const id = `${clusterName}-${domainName}`

    const domain = await this.esService.getById<IDomain>(ESIndex.DOMAIN, id)
    const { rules } = domain
    const pathTypeList = Object.keys(countBy(rules, (rule) => rule?.pathType || 'None'))

    let matchRules = rules
    if (searchBy) {
      matchRules = rules.filter((rule) => {
        const { path, pathType, target, priority } = rule

        return (
          path.includes(searchBy) ||
          pathType.includes(searchBy) ||
          priority.toString().includes(searchBy) ||
          Object.values(target).find((value) => JSON.stringify(value).includes(searchBy))
        )
      })
    }

    return {
      ...domain,
      rules: matchRules,
      pathTypeList,
      total: matchRules.length
    }
  }

  async getDomainGroups() {
    const { documents, total } = await this.esService.matchAll(ESIndex.DOMAIN_GROUP, ES_SUPER_MAX_SEARCH_COUNT)

    return {
      domainGroups: documents,
      total
    }
  }

  async getDomainGroup(domainGroupName) {
    const domainGroup = await this.esService.getById<IDomainGroup>(ESIndex.DOMAIN_GROUP, domainGroupName)
    if (!domainGroup) {
      throw new BadRequestException(`Domain Group: ${domainGroupName} did not exist!`)
    }
    const { name, domain, cid, env, cluster } = domainGroup

    return {
      name,
      domain,
      cid,
      env,
      cluster,
      total: domain.length
    }
  }
}

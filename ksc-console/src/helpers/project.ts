import { IFormattedClusters } from 'components/App/ProjectMGT/Common/ProjectModalForm'
import { addUnitOfMemory } from 'helpers/format'
import { IPayloadEnvQuota } from 'swagger-api/models'

interface IFormEnvQuotas {
  clusters: Record<string, IFormattedClusters>
}
// for create project and update project
export const generateRequestEnvQuotas = (formEnvQuotas: IFormEnvQuotas): IPayloadEnvQuota[] => {
  const result: Record<string, IPayloadEnvQuota> = {}
  const checkedClusters = Object.values(formEnvQuotas.clusters).flatMap(
    (item: IFormattedClusters) => item.envQuotas.filter((item) => item.isEnvChecked),
  )
  checkedClusters.forEach((item) => {
    const { env, clusterId, quota } = item
    const { cpu, memory, gpu } = quota
    if (!result[env]) {
      result[env] = {
        env,
        clusterQuota: [],
      }
    }
    result[env].clusterQuota.push({
      clusterId,
      quota: {
        cpu: Number(cpu),
        gpu: Number(gpu),
        memory: addUnitOfMemory(memory),
      },
    })
  })
  return Object.values(result)
}

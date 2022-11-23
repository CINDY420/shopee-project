interface IBuildQuotaItemName {
  tenantId: string
  env: string
}
const buildCombiner = '==='
export const buildQuotaItemName = ({ tenantId, env }: IBuildQuotaItemName): string =>
  `${tenantId}${buildCombiner}${env}`

export const parseQuotaItemName = (
  quotaItemName: string,
): {
  tenantId?: string
  env?: string
} => {
  const [tenantId, env] = quotaItemName.split(buildCombiner)
  return { tenantId, env }
}

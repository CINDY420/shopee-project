import { CLUSTER } from 'src/constants/routes/routes'

interface IBuildClusterId {
  clusterId: number | string
}
export const buildClusterDetailRoute = ({ clusterId }: IBuildClusterId) => `${CLUSTER}/${clusterId}`

interface IBuildSecretId {
  namespace: string
  secretName: string
}
const buildSecretId = ({ namespace, secretName }: IBuildSecretId) => `${namespace}===${secretName}`
export const parseSecretId = (secretId: string): IBuildSecretId => {
  const [namespace, secretName] = secretId.split('===')
  return { namespace, secretName }
}

export const buildSecretDetailRoute = ({
  clusterId,
  namespace,
  secretName,
}: IBuildClusterId & IBuildSecretId) =>
  `${buildClusterDetailRoute({ clusterId })}/secret/${buildSecretId({ namespace, secretName })}`

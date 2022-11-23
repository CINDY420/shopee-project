import { ERROR } from '@/common/constants/error'
import { throwError } from '@/common/utils/throw-error'

export const parseClusterId = (clusterId: string) => {
  // ClusterId两种形式,  fte:env-Cid:clusterName 或者 env-Cid:clusterName

  if (!clusterId) {
    throwError(ERROR.SYSTEM_ERROR.COMMON.PARSE_REQUEST_PARAMS_ERROR, 'clusterId', 'clusterId is empty')
  }

  const clusterInfos = clusterId.split(':')

  if (clusterInfos.length === 3) {
    const [fte, envWithCid, clusterName] = clusterId.split(':')
    const [env, cid] = envWithCid.split('-')
    return {
      fte,
      env,
      cid,
      clusterName,
    }
  }

  if (clusterInfos.length === 2) {
    const [envWithCid, clusterName] = clusterId.split(':')
    const [env, cid] = envWithCid.split('-')

    return {
      env,
      cid,
      clusterName,
    }
  }

  throwError(ERROR.SYSTEM_ERROR.COMMON.PARSE_REQUEST_PARAMS_ERROR, 'clusterId', 'format not matched')
}

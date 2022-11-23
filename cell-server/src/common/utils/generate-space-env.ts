import { SPACE_ENVIRONMENT } from '@infra-node-kit/space-auth'

export const generateSpaceEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'local':
      return SPACE_ENVIRONMENT.LOCAL
    case 'test':
      return SPACE_ENVIRONMENT.TEST
    case 'live':
      return SPACE_ENVIRONMENT.LIVE
    default:
      return SPACE_ENVIRONMENT.LIVE
  }
}

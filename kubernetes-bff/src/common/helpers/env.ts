import { ENV_PRIORITY_MAP, RELEASE_FREEZE_ENV } from 'common/constants/env'

export const orderEnvs = (envs: string[]): string[] =>
  envs.sort((secondItem, firstItem) => {
    const firstItemPriority = ENV_PRIORITY_MAP[firstItem] || 0
    const secondItemPriority = ENV_PRIORITY_MAP[secondItem] || 0

    if (firstItemPriority === secondItemPriority) {
      return secondItem < firstItem ? 1 : -1
    }

    return secondItemPriority < firstItemPriority ? 1 : -1
  })

export const envToLiveOrNonLive = (env: string): string => {
  const lives = ['live', 'liveish']
  return lives.includes(env) ? RELEASE_FREEZE_ENV.LIVE : RELEASE_FREEZE_ENV.NON_LIVE
}

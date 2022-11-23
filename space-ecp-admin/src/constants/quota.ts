export enum ENV {
  LIVE = 'live',
  LIVEISH = 'liveish',
  TEST = 'test',
  UAT = 'uat',
  STAGING = 'staging',
  STABLE = 'stable',
}

export const envOrderMap: Record<string, number> = {
  [ENV.LIVE]: 1,
  [ENV.LIVEISH]: 2,
  [ENV.TEST]: 3,
  [ENV.UAT]: 4,
  [ENV.STAGING]: 5,
  [ENV.STABLE]: 6,
}

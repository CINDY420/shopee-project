export const ENV_PRIORITY_MAP = {
  STABLE: 1,
  LIVEISH: 2,
  LIVE: 3,
  STAGING: 4,
  UAT: 5,
  TEST: 6,
  DEV: 7
}

export enum ENV {
  live = 'LIVE'
}

export enum RELEASE_FREEZE_ENV {
  LIVE = 'Live',
  NON_LIVE = 'Non-live'
}

export enum SPECIAL_APPLICATIONS_ENV {
  FTE = 'FTE',
  PFB = 'PFB'
}

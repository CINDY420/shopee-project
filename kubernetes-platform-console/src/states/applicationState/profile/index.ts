import { atom } from 'recoil'

import { IProfile } from 'api/types/application/pod'

export const selectedProfile = atom<IProfile>({
  key: 'selectedProfile',
  default: {}
})

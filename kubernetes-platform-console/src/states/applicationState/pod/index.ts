import { atom } from 'recoil'

import { IPod } from 'api/types/application/pod'

export const selectedPod = atom<IPod>({
  key: 'selectedPod',
  default: {}
})

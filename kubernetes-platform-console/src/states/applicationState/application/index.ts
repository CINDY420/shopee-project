import { atom } from 'recoil'

import { IGetApplicationResponse } from 'swagger-api/v1/models'

export const selectedApplication = atom<IGetApplicationResponse>({
  key: 'selectedApplication',
  default: {}
})

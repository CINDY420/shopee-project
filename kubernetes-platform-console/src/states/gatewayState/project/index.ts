import { atom } from 'recoil'

import { IProject } from 'api/types/application/project'

export const selectedGatewayProject = atom<IProject>({
  key: 'selectedGatewayProject',
  default: {}
})

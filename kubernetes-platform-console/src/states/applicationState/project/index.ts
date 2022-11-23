import { atom } from 'recoil'

import { IProject } from 'api/types/application/project'

export const selectedProject = atom<IProject>({
  key: 'selectedProject',
  default: {}
})

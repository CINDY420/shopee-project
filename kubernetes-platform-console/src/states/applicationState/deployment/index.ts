import { atom } from 'recoil'

import { IDeployBaseInfo, IDeploy } from 'api/types/application/deploy'

export const selectedDeployment = atom<IDeployBaseInfo>({
  key: 'selectedDeployment',
  default: {}
})

export const editingDeployment = atom<IDeploy>({
  key: 'editingDeployment',
  default: undefined
})

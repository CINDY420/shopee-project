import { atom } from 'recoil'

import { ITree } from 'api/types/application/tree'

export const selectedTreeNodes = atom<string>({
  key: 'selectedTreeNode',
  default: []
})

export const selectedExpandedNodes = atom<string>({
  key: 'selectedExpandedNode',
  default: []
})

export const tree = atom<ITree>({
  key: 'tree',
  default: []
})

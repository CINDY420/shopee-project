import { atom } from 'recoil'

import { INode } from 'api/types/cluster/node'

export const selectedNode = atom<INode>({
  key: 'selectedNode',
  default: {}
})

import { atom } from 'recoil'

export const gatewaySelectedTreeNodes = atom<string>({
  key: 'gatewaySelectedTreeNodes',
  default: []
})

export const gatewaySelectedExpandedNodes = atom<string>({
  key: 'gatewaySelectedExpandedNodes',
  default: []
})

import { atom } from 'recoil'

interface ISwitchedTenant {
  id: number
}

export const switchedTenant = atom<ISwitchedTenant>({
  key: 'switchedTenant',
  default: {}
})

import { atom } from 'recoil'

interface ISelectedTenant {
  id: number
}

export const selectedTenant = atom<ISelectedTenant>({
  key: 'selectedTenant',
  default: {}
})

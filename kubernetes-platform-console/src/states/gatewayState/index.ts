import { atom } from 'recoil'

export const selectedGateway = atom({
  key: 'selectedGateway',
  default: undefined
})

export const selectedGatewayTenant = atom({
  key: 'selectedGatewayGroup',
  default: undefined
})

export const selectedGatewayLoadBalanceDomainGroup = atom({
  key: 'selectedGatewayLoadBalanceDomainGroup',
  default: undefined
})

export const selectedDomainGroup = atom({
  key: 'selectedDomainGroup',
  default: undefined
})

export const selectedDomain = atom({
  key: 'selectedDomain',
  default: undefined
})

export const selectedIngress = atom({
  key: 'selectedIngress',
  default: undefined
})

export const selectedGatewayLoadBalanceResourceType = atom({
  key: 'selectedGatewayLoadBalanceResourceType',
  default: undefined
})

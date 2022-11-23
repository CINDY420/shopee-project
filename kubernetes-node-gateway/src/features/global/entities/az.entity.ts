export enum AZ_TYPE {
  KUBERNETES = 'kubernetes',
  BROMO = 'bromo',
  ECP = 'ecp',
}

export class AZ {
  name: string
  type: AZ_TYPE
  env: string
  clusters: string[]
}

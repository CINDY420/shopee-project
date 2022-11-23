import { SetMetadata } from '@nestjs/common'

export const Pagination = (property: Record<'key' | 'countKey' | 'defaultOrder', string>) =>
  SetMetadata('pagination', property)

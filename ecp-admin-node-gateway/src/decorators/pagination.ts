import { IPaginationContext } from '@/interfaces/pagination'
import { SetMetadata } from '@nestjs/common'

export const Pagination = (property: IPaginationContext) => SetMetadata('pagination', property)

import { IPaginationContext } from '@/common/interfaces/pagination'
import { SetMetadata } from '@nestjs/common'

export const Pagination = (property: IPaginationContext) => SetMetadata('pagination', property)

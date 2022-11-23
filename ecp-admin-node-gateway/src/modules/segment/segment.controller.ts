import { Pagination } from '@/decorators/pagination'
import { PaginateInterceptor } from '@/interceptors/pagination.inteceptor'
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  GetSegmentParams,
  GetSegmentResponse,
  ListSegmentsQuery,
  ListSegmentsResponse,
} from '@/modules/segment/dto/segment.dto'
import { SegmentService } from '@/modules/segment/segment.service'

@ApiTags('Segment')
@Controller('segments')
export class SegmentController {
  constructor(private segmentService: SegmentService) {}

  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'name',
    filterable: true,
    searchable: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get()
  listSegments(@Query() _listSegmentsQuery: ListSegmentsQuery): Promise<ListSegmentsResponse> {
    return this.segmentService.listSegments()
  }

  @Get(':segmentId')
  GetSegmentDetail(@Param() getSegmentParams: GetSegmentParams): Promise<GetSegmentResponse> {
    return this.segmentService.getSegment(getSegmentParams.segmentId)
  }
}

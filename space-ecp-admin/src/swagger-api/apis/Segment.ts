/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface ISegmentController_listSegmentsParams {
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type SegmentController_listSegmentsFn = (
  params: ISegmentController_listSegmentsParams,
  extra?: any
) => Promise<types.IListSegmentsResponse>

export const segmentController_listSegments: SegmentController_listSegmentsFn = async (
  { offset, limit, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/segments',
      method: 'GET',
      params: { offset, limit, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface ISegmentController_GetSegmentDetailParams {
  segmentId: string
}

type SegmentController_GetSegmentDetailFn = (
  params: ISegmentController_GetSegmentDetailParams,
  extra?: any
) => Promise<types.IGetSegmentResponse>

export const segmentController_GetSegmentDetail: SegmentController_GetSegmentDetailFn = async (
  { segmentId },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/segments/${segmentId}`,
      method: 'GET'
    },
    extra
  )

  return body
}

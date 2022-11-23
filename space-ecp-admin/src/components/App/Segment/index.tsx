import React from 'react'
import { Switch, Route, Redirect, matchPath } from 'react-router'
import { SEGMENT_LIST, SEGMENT_DETAIL } from 'src/constants/routes/routes'
import Fetch from 'src/hocs/fetch'
import { fetch } from 'src/rapper'
import SegmentDetail from 'src/components/App/Segment/SegmentDetail'
import SegmentList from 'src/components/App/Segment/SegmentList'

interface ISegmentDetailRouteParams {
  segmentId: string
}

const fetchSegmentDetailFn = () => {
  const match = matchPath<ISegmentDetailRouteParams>(location.pathname, {
    path: SEGMENT_DETAIL,
  })
  const segmentId = match?.params.segmentId || ''
  return fetch['GET/ecpadmin/segments/{segmentId}']({ segmentId })
}
const FetchSegmentDetail = Fetch(SegmentDetail, fetchSegmentDetailFn)

const Segment: React.FC = () => (
  <Switch>
    <Route exact path={SEGMENT_LIST} component={SegmentList} />
    <Route exact path={SEGMENT_DETAIL} component={FetchSegmentDetail} />
    <Redirect to={SEGMENT_LIST} />
  </Switch>
)

export default Segment

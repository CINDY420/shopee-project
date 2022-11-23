import React from 'react'

export const SegmentDetailContext = React.createContext<{
  azKey: string
  azName: string
  segmentKey: string
  segmentName: string
}>({
  azKey: '',
  segmentKey: '',
  azName: '',
  segmentName: '',
})

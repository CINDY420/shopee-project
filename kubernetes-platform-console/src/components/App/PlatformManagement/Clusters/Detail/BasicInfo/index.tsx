import React from 'react'
import { Root } from './style'

import Configuration from './Configuration'
import PodFlavor from './PodFlavor'

const BasicInfo = () => {
  return (
    <Root>
      <Configuration />
      <PodFlavor />
    </Root>
  )
}

export default BasicInfo

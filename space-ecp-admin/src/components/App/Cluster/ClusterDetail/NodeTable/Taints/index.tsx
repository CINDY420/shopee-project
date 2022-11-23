import React from 'react'

import {
  Root,
  TaintWrapper,
  TaintValueWrapper,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taints/style'
import MoreCollapse from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taints/MoreCollapse'
import { Tooltip } from 'infrad'

interface ITaint {
  effect: string
  key: string
  value: string
}

interface ITaintsProps {
  taints: ITaint[]
}

const Taints: React.FC<ITaintsProps> = ({ taints = [] }) =>
  taints.length > 0 ? (
    <MoreCollapse
      needMore={taints.length > 1}
      panel={
        <Root>
          {taints.map((taint) => (
            <TaintWrapper key={`${taint.key}-${taint.value}`}>
              {Object.entries(taint).map(([key, content]) => (
                <Tooltip title={content} key={key}>
                  <TaintValueWrapper>
                    <span>{key}:</span> {content || '-'}
                  </TaintValueWrapper>
                </Tooltip>
              ))}
            </TaintWrapper>
          ))}
        </Root>
      }
    />
  ) : (
    <span>-</span>
  )
export default Taints

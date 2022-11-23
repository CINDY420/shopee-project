import * as React from 'react'
import { Empty, Tooltip } from 'infrad'

import { INode } from 'api/types/cluster/node'
import { Root, TaintWrapper, TaintValueWrapper } from './style'
interface IProps {
  node: INode
}

const Taint: React.FC<IProps> = ({ node }) => {
  const { taints } = node

  return taints ? (
    <Root>
      {taints.map((taint, index) => (
        <TaintWrapper key={index}>
          {Object.keys(taint).map((obj, idx) => {
            const content: string = taint[obj]
            return (
              <Tooltip title={content.length > 14 ? content : ''} key={idx}>
                <TaintValueWrapper>
                  <span>{obj}:</span> {content || '-'}
                </TaintValueWrapper>
              </Tooltip>
            )
          })}
        </TaintWrapper>
      ))}
    </Root>
  ) : (
    <Empty />
  )
}

export default Taint

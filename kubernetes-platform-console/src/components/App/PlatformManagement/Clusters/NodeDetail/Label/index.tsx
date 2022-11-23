import * as React from 'react'
import { Empty, Tag } from 'infrad'

import { INode } from 'api/types/cluster/node'
interface IProps {
  node: INode
}

const Label: React.FC<IProps> = ({ node }) => {
  const { labels } = node

  return labels ? (
    <>
      {Object.keys(labels).map(key => {
        const content = `${key}=${labels[key]}`
        return (
          <Tag style={{ marginBottom: '5px' }} key={content}>
            {content}
          </Tag>
        )
      })}
    </>
  ) : (
    <Empty />
  )
}

export default Label

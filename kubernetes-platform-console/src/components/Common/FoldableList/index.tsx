import * as React from 'react'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

import { StyledA } from './style'

interface IProps {
  renderItem: (item) => React.ReactNode
  dataSource: any[]
  fold?: {
    rows?: number
    expandSymbol?: React.ReactNode
    collapseSymbol?: React.ReactNode
  }
}

const Foldable: React.FC<IProps> = ({ renderItem, dataSource = [], fold = {} }) => {
  const [isExpand, setIsExpand] = React.useState(false)

  const { rows, expandSymbol, collapseSymbol } = fold

  const collapse = React.useCallback(() => {
    return (
      collapseSymbol || (
        <StyledA onClick={e => e.preventDefault()}>
          Collapse <UpOutlined />
        </StyledA>
      )
    )
  }, [collapseSymbol])

  const expand = React.useCallback(() => {
    return (
      expandSymbol || (
        <StyledA onClick={e => e.preventDefault()}>
          More <DownOutlined />
        </StyledA>
      )
    )
  }, [expandSymbol])

  const renderDataSource = React.useMemo(() => {
    return rows && !isExpand ? dataSource.slice(0, rows) : dataSource
  }, [dataSource, isExpand, rows])

  return (
    <>
      {renderDataSource.map((data, index) => {
        return <div key={index}>{renderItem(data)}</div>
      })}
      {dataSource.length > rows && (
        <div onClick={() => setIsExpand(!isExpand)} style={{ display: 'inline-block' }}>
          {isExpand ? collapse() : expand()}
        </div>
      )}
    </>
  )
}

export default Foldable

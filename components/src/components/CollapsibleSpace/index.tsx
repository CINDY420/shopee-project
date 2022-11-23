import { ReactNode, useEffect, useState } from 'react'
import { Space, SpaceProps, Typography } from 'infrad'
import { IArrowDown, IArrowUp } from 'infra-design-icons'

export interface ICollapsibleSpaceProps extends SpaceProps {
  /**
   * Default count of children to be displayed whether the children are collapsed or not
   */
  fixedChildCount?: number
  /**
   * The state of the children be collapsed or not
   * @default true
   */
  collapsed?: boolean
  /**
   * Customize the "More" text
   */
  moreText?: string | ReactNode
  /**
   * Customize the "Collapse" text
   */
  collapseText?: string | ReactNode
  /**
   * Callback will be called when "Collapse" be click
   */
  onCollapse?: () => void
  /**
   * Callback will be called when "More" be click
   */
  onExpand?: () => void
}

const defaultMoreText = (
  <Typography.Link>
    <span style={{ marginRight: '3px' }}>More</span>
    <IArrowDown />
  </Typography.Link>
)
const defaultCollapseText = (
  <Typography.Link>
    <span style={{ marginRight: '3px' }}>Collapse</span>
    <IArrowUp />
  </Typography.Link>
)

const CollapsibleSpace: React.FC<ICollapsibleSpaceProps> = ({
  fixedChildCount = 3,
  collapsed: defaultCollapsed = true,
  moreText = defaultMoreText,
  collapseText = defaultCollapseText,
  onCollapse,
  onExpand,
  children,
  ...others
}) => {
  const allChildList = Array.isArray(children) ? children : [children]
  const defaultChildList = allChildList.slice(0, fixedChildCount)

  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const handleActionClick = () =>
    setCollapsed((collapsed) => {
      if (collapsed) {
        onExpand?.()
      } else {
        onCollapse && onCollapse()
      }
      return !collapsed
    })

  const actionElement = (
    <span onClick={handleActionClick}>{collapsed ? moreText : collapseText}</span>
  )

  // update collapsed state if the parent component change it
  useEffect(() => {
    setCollapsed(defaultCollapsed)
  }, [defaultCollapsed])

  return (
    <Space {...others}>
      {collapsed ? defaultChildList : allChildList}
      {allChildList.length > fixedChildCount ? actionElement : null}
    </Space>
  )
}

export default CollapsibleSpace

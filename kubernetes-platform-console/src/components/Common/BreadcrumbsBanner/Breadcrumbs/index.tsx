import * as React from 'react'
import { Breadcrumb } from 'infrad'
import warning from 'warning'

import Collapsed from './Collapsed'
import { StyledBreadcrumb } from './style'

interface IComponentProps {
  className?: string
  children: React.ReactNode
}

interface IBreadcrumbsProps {
  className?: string
  children: React.ReactNode
  component?: string | React.ReactType<IComponentProps>
  itemsAfterCollapse?: number
  itemsBeforeCollapse?: number
  maxItems?: number
  separator?: string | React.ReactNode
}

const Breadcrumbs: React.FC<IBreadcrumbsProps> = props => {
  const {
    maxItems = 8,
    itemsAfterCollapse = 2,
    itemsBeforeCollapse = 2,
    component: Component = 'nav',
    children,
    className,
    separator
  } = props

  const renderItems = (allItems: any[]) => {
    if (itemsAfterCollapse + itemsBeforeCollapse >= maxItems) {
      warning(
        false,
        [
          'Common Component: you have provided an invalid combination of properties to the Breadcrumbs.',
          `itemsAfterCollapse={${itemsAfterCollapse}} + itemsBeforeCollapse={${itemsBeforeCollapse}} >= maxItems={${maxItems}}`
        ].join('\n')
      )

      return allItems
    }

    if (allItems.length > maxItems) {
      const end = allItems.length - itemsAfterCollapse
      return (
        <>
          {allItems.slice(0, itemsBeforeCollapse).map((item, index) => (
            <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          ))}
          <Collapsed>{allItems.slice(itemsBeforeCollapse, end)}</Collapsed>
          {allItems.slice(end).map((item, index) => (
            <Breadcrumb.Item key={index + end}>{item}</Breadcrumb.Item>
          ))}
        </>
      )
    }

    return allItems.map((item, index) => <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
  }

  const allItems = React.Children.toArray(children)

  return (
    <Component className={className}>
      <StyledBreadcrumb separator={separator}>{renderItems(allItems)}</StyledBreadcrumb>
    </Component>
  )
}

export default Breadcrumbs

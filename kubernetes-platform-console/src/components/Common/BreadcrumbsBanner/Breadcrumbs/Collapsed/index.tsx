import * as React from 'react'
import { Breadcrumb, Menu } from 'infrad'

interface ICollapsedProps {
  children: React.ReactNode
}

const Collapsed: React.FC<ICollapsedProps> = ({ children }) => {
  const collapsedItems = React.Children.toArray(children)

  const menu = (
    <Menu>
      {collapsedItems.map((item, index) => (
        <Menu.Item key={index}>{item}</Menu.Item>
      ))}
    </Menu>
  )

  return <Breadcrumb.Item overlay={menu}>{collapsedItems[0]}</Breadcrumb.Item>
}

export default Collapsed

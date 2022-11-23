import * as React from 'react'

import { Root, Label, Content } from './style'

interface IProps {
  label: string
  Component?: any
}

const Item: React.FC<IProps> = ({ label, Component, children }) => {
  return (
    <Root>
      <Label>{label}</Label>
      <Content>{Component ? <Component /> : children}</Content>
    </Root>
  )
}

export default Item

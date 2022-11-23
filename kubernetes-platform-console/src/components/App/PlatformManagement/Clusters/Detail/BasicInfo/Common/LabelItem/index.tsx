import React from 'react'
import { Label, Item, LabelItemWrapper } from './style'

interface ILabelItem {
  label: string
  item: string | React.ReactNode
}

const LabelItem: React.FC<ILabelItem> = ({ label, item }) => {
  return (
    <LabelItemWrapper>
      <Label>{label}</Label>
      <Item>{item}</Item>
    </LabelItemWrapper>
  )
}

export default LabelItem

import * as React from 'react'
import { Typography } from 'infrad'

const { Text: AntdText } = Typography

interface IProps {
  title: React.ReactNode
  value: string | number
}

const Text: React.FC<IProps> = ({ title, value }) => {
  return (
    <div style={{ display: 'block' }}>
      <AntdText type='secondary' style={{ marginRight: '16px' }}>
        {title}
      </AntdText>
      <AntdText>{value}</AntdText>
    </div>
  )
}

export default Text

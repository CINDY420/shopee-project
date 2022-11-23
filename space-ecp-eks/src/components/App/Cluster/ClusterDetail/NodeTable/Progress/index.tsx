import React from 'react'
import { Space, Progress as AntdProgress, Typography } from 'infrad'

interface IProgressProps {
  header: string
  percent: number
}
const { Text } = Typography

const Progress: React.FC<IProgressProps> = (props) => {
  const { header, percent } = props

  return (
    <Space size={4} direction="vertical">
      <div>{header}</div>
      <AntdProgress
        percent={percent}
        strokeColor="#A6D4FF"
        style={{ width: '100px' }}
        showInfo={false}
      />
      <Text type="secondary">{`${percent}%`}</Text>
    </Space>
  )
}

export default Progress

import React from 'react'
import { EyeInvisibleOutlined, IView } from 'infra-design-icons'
import { Space } from 'infrad'

interface IValueItemProps {
  value: string
}

const ValueItem: React.FC<IValueItemProps> = ({ value }) => {
  const [isHidden, setIsHidden] = React.useState(true)

  return (
    <>
      {isHidden ? (
        <Space size={8}>
          <>***************</>
          <EyeInvisibleOutlined
            style={{ color: 'rgba(0, 0, 0, 0.45)' }}
            onClick={() => setIsHidden((isHidden) => !isHidden)}
          />
        </Space>
      ) : (
        <Space>
          <>{value}</>
          <IView
            style={{ color: 'rgba(0, 0, 0, 0.45)' }}
            onClick={() => setIsHidden((isHidden) => !isHidden)}
          />
        </Space>
      )}
    </>
  )
}

export default ValueItem

import React from 'react'
import { Space, Typography } from 'infrad'
import { ITaint } from 'src/swagger-api/models'
import { TextWrapper } from 'src/components/App/Cluster/ClusterDetail/NodeTable/Taint/style'
import { IArrowDown, IArrowUp } from 'infra-design-icons'

const { Text } = Typography

interface ITaintProps {
  taints: ITaint[]
}
const Taint: React.FC<ITaintProps> = (props) => {
  const { taints } = props
  const [isExpandAllTaints, setIsExpandAllTaints] = React.useState(false)

  return (
    taints?.length > 0 && (
      <Space direction="vertical" size={4}>
        <TextWrapper>
          <Text type="secondary" style={{ marginRight: '5px' }}>
            key:{' '}
          </Text>
          <Text>{taints?.[0]?.key}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text type="secondary" style={{ marginRight: '5px' }}>
            value:{' '}
          </Text>
          <Text>{taints?.[0]?.value}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text type="secondary" style={{ marginRight: '5px' }}>
            effect:{' '}
          </Text>
          <Text>{taints?.[0]?.effect}</Text>
        </TextWrapper>
        {taints.length > 1 && !isExpandAllTaints && (
          <div onClick={() => setIsExpandAllTaints(true)} style={{ cursor: 'pointer' }}>
            <span style={{ color: '#2673DD' }}>More</span>
            <IArrowDown style={{ color: '#2673DD' }} />
          </div>
        )}
        {taints.length > 1 && isExpandAllTaints && (
          <>
            {taints.slice(1)?.map((taint) => (
              <div key={`${taint?.key}-${taint?.value}-${taint?.effect}`}>
                <TextWrapper>
                  <Text type="secondary" style={{ marginRight: '5px' }}>
                    key:{' '}
                  </Text>
                  <Text>{taint?.key}</Text>
                </TextWrapper>
                <TextWrapper>
                  <Text type="secondary" style={{ marginRight: '5px' }}>
                    value:{' '}
                  </Text>
                  <Text>{taint?.value}</Text>
                </TextWrapper>
                <TextWrapper>
                  <Text type="secondary" style={{ marginRight: '5px' }}>
                    effect:{' '}
                  </Text>
                  <Text>{taint?.effect}</Text>
                </TextWrapper>
              </div>
            ))}
            <div onClick={() => setIsExpandAllTaints(false)} style={{ cursor: 'pointer' }}>
              <span style={{ color: '#2673DD' }}>Fold</span>
              <IArrowUp style={{ color: '#2673DD' }} />
            </div>
          </>
        )}
      </Space>
    )
  )
}

export default Taint

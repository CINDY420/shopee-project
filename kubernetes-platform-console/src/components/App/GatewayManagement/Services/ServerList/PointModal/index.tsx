import * as React from 'react'
import { Tag, Button, message } from 'infrad'
import copy from 'copy-to-clipboard'

import { PointWrapper, FooterWrapper, Modal } from './style'

import { Text } from '../style'

interface IPointModalProps {
  visible?: boolean
  endPoints?: string[]
  onCancel?: () => void
}

const copyAll = (endPoints: string[]) => {
  const endPointsText = endPoints.toString()

  if (copy(endPointsText)) {
    message.success('copy successfully!')
  } else {
    message.error('copy failed!')
  }
}

const PointModal: React.FC<IPointModalProps> = ({ visible = false, endPoints = [], onCancel }) => {
  const length = endPoints.length

  const handleCancel = React.useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  return (
    <Modal
      visible={visible}
      title='Endpoints'
      closable={false}
      mask={false}
      footer={[
        <FooterWrapper key='copy'>
          <Text>
            Total <span style={{ color: '#2673DD' }}>{length}</span>
          </Text>
          <Button type='primary' size='small' onClick={() => copyAll(endPoints)}>
            Copy All
          </Button>
        </FooterWrapper>
      ]}
      onCancel={handleCancel}
      getContainer={() => document.body}
      width={722}
    >
      <PointWrapper>
        {endPoints.map((item: string, index: number) => (
          <Tag key={`${item}-${index}`} style={{ margin: '0 8px 8px 0' }}>
            {item}
          </Tag>
        ))}
      </PointWrapper>
    </Modal>
  )
}

export default PointModal

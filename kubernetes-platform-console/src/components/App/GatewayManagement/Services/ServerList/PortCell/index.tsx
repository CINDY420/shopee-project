import * as React from 'react'
import { Divider, Tooltip } from 'infrad'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import { MoreWrapper, PortItem } from './style'
import { Title, Text } from '../style'

interface IPortCellProps {
  ports: Array<{
    port: string
    targetPort: string
    protocol: string
    name: string
  }>
}

const portOptions = [
  { key: 'port', text: 'Port: ' },
  { key: 'targetPort', text: 'Target Port: ' },
  { key: 'protocol', text: 'Protocol: ' },
  { key: 'name', text: 'Name: ' }
]

const PortCell: React.FC<IPortCellProps> = ({ ports = [] }) => {
  const length = ports.length
  const [isOpened, setIsOpened] = React.useState(false)

  const handleClick = e => {
    setIsOpened(!isOpened)
  }

  const portList = isOpened ? ports : ports.slice(0, 1) || []

  return (
    <div>
      {portList.map((item, index: number) => (
        <React.Fragment key={`${item.port}-${item.targetPort}-${item.protocol}`}>
          {index > 0 && <Divider dashed style={{ color: 'e8e8e8', margin: '8px 0 16px' }} />}
          {portOptions.map(optionItem => (
            <React.Fragment key={optionItem.key}>
              <PortItem>
                <Text size={14} lineHeight={16}>
                  {optionItem.text}
                </Text>
                <Tooltip title={item[optionItem.key]} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
                  <Title
                    size={14}
                    lineHeight={16}
                    style={{ maxWidth: '160px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {item[optionItem.key]}
                  </Title>
                </Tooltip>
              </PortItem>
              <VerticalDivider size='8px' />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
      {length > 1 ? (
        <MoreWrapper onClick={handleClick}>
          {isOpened ? (
            <>
              <span>Collapse</span>
              <HorizontalDivider size='8px' />
              <UpOutlined style={{ color: '#1890FF' }} />
            </>
          ) : (
            <>
              <span>More</span>
              <HorizontalDivider size='8px' />
              <DownOutlined style={{ color: '#1890FF' }} />
            </>
          )}
        </MoreWrapper>
      ) : null}
    </div>
  )
}

export default PortCell

import * as React from 'react'
import { Popover, Radio } from 'infrad'
import Draggable from 'react-draggable'
import { EditOutlined } from 'infra-design-icons'

import { DEVELOPING_VERSIONS } from 'constants/versionControl'
import { getDispatchers, GlobalContext } from 'hocs/useGlobalContext'

import { StyledAvatar, Wrapper } from './style'

const VersionController: React.FC = () => {
  const [visible, setVisible] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const { state, dispatch } = React.useContext(GlobalContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const { selectedVersion } = state

  const handleSwitchVersion = React.useCallback(
    version => {
      dispatchers.selectVersion(version)
      setVisible(false)
    },
    [dispatchers]
  )

  const content = React.useMemo(() => {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    }
    return (
      <Radio.Group value={selectedVersion} onChange={handleSwitchVersion}>
        {Object.values(DEVELOPING_VERSIONS).map((version: DEVELOPING_VERSIONS) => {
          return (
            <Radio key={version} value={version} style={radioStyle} onClick={() => handleSwitchVersion(version)}>
              {version}
            </Radio>
          )
        })}
      </Radio.Group>
    )
  }, [handleSwitchVersion, selectedVersion])

  return (
    <Popover
      trigger='click'
      content={content}
      visible={visible}
      title='developing version'
      onVisibleChange={visible => setVisible(visible)}
      getPopupContainer={() => document.body}
      arrowPointAtCenter
    >
      <Draggable
        onDrag={e => {
          setVisible(false)
          setIsDragging(true)
        }}
        onStop={() => setIsDragging(false)}
      >
        <Wrapper onClick={() => setVisible(!visible)} isDragging={isDragging}>
          <StyledAvatar icon={<EditOutlined />} isActive={visible} />
        </Wrapper>
      </Draggable>
    </Popover>
  )
}

export default VersionController

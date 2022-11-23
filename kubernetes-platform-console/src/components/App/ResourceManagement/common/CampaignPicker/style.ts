import styled from 'styled-components'
import { IArrowLeftDouble, IArrowRightDouble } from 'infra-design-icons'

export const PanelContainer = styled.div`
  position: absolute;
  z-index: 1000;
  display: flex;
`

export const Panel = styled.div`
  width: 280px;
  min-height: 96px;
  display: flex;
  flex-direction: column;
`

export const PanelHeader = styled.div`
  height: 40px;
  padding: 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #f0f0f0;
`

export const PrevIcon = styled(IArrowLeftDouble)`
  color: rgba(0, 0, 0, 0.25);
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #2673dd;
  }
`

export const NextIcon = PrevIcon.withComponent(IArrowRightDouble)

export const PanelContent = styled.div`
  padding: 12px 10px;
  flex: 1;
  position: relative;
`

export const Empty = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  color: rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%);
`

interface IPanelItem {
  selected: boolean
  selectable: boolean
  isInRange: boolean
}

const getBackground = (props: IPanelItem) => {
  if (!props.selectable) {
    return 'rgba(0,0,0,.04)'
  } else if (props.selected) {
    return '#2673DD'
  } else if (props.isInRange) {
    return '#F0F9FF'
  } else {
    return 'unset'
  }
}

const getColor = (props: IPanelItem) => {
  if (!props.selectable) {
    return '#00000040'
  } else if (props.selected) {
    return '#ffffff'
  } else {
    return 'unset'
  }
}

export const PannelInner = styled.div`
  height: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  background: ${(props: IPanelItem) => getBackground(props)};
  color: ${(props: IPanelItem) => getColor(props)};
  pointer-events: ${(props: IPanelItem) => (props.selectable ? 'unset' : 'none')};

  &:hover {
    background: ${(props: IPanelItem) => (props.selected ? '#2673DD' : '#f5f5f5')};
  }
`

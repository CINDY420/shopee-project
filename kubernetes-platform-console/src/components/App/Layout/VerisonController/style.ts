import { Avatar } from 'infrad'
import styled from 'styled-components'

import { primary, grey } from 'constants/colors'

interface IWrapper {
  isDragging: boolean
}

export const Wrapper = styled.div<IWrapper>`
  position: absolute;
  z-index: 1000;
  right: 80px;
  bottom: 50px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  pointer-events: ${props => (props.isDragging ? 'none' : 'all')};
`

interface IAvatar {
  isActive: boolean
}

export const StyledAvatar = styled(Avatar)<IAvatar>`
  // position: absolute;
  background: ${props => (props.isActive ? primary : grey)};
  // z-index: 1000;
  // right: 80px;
  // bottom: 50px;
  // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
`

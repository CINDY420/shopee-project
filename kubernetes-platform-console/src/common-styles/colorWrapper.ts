import styled from 'styled-components'
import { danger, success, grey, unknown } from 'constants/colors'

const ColorWrapper = styled.div`
  color: ${(props: any) => props.color || success};
  svg {
    margin-right: 5px;
  }
`

export const DangerWrapper = styled.div`
  color: ${danger};
`

export const SuccessWrapper = styled.div`
  color: ${success};
`

export const GreyWrapper = styled.div`
  color: ${grey};
`
export const UnknownWrapper = styled.div`
  color: ${unknown};
`

export default ColorWrapper

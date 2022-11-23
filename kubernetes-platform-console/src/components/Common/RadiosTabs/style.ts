import styled from 'styled-components'

interface IProps {
  value: string | number
  activeValue: string | number | undefined
}

export const Container = styled.div<IProps>`
  width: 100%;
  ${props => {
    return props.activeValue === props.value ? '' : 'height: 0; overflow: hidden;'
  }}
`

export const FlexWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

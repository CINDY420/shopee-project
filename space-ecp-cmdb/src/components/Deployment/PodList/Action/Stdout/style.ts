import { Space } from 'infrad'
import styled from 'styled-components'

export const Container = styled(Space)`
  font-weight: 400;
  font-size: 14;
`

export const Title = styled.div`
  font-weight: 500;
  font-size: 16;
`

export const ModalBody = styled.div`
  overflow-x: auto;
  overflow-y: scroll;
  width: 100%;
  max-height: 960px;
  font-size: 16;
`

export const Line = styled.p`
  white-space: pre;
  margin: 2px 0;
  transition: 0.2s all;
  &:hover {
    background-color: #f0f2f5;
  }
`

export const CenterTextWrapper = styled.div`
  text-align: center;
`

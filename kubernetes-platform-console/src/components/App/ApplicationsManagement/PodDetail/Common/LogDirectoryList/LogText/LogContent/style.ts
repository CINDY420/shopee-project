import styled from 'styled-components'
import { Empty, Card } from 'infrad'

export const Root = styled.div`
  position: absolute;
  top: 48px;
  bottom: 0;
  width: 100%;
`

export const ContentRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 120px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1em;
  overflow: auto;
`

export const Content: any = styled.div`
  width: 100%;
  height: auto;
  border: none;
  white-space: pre-wrap;
`

export const DummyDiv = styled.div`
  float: left;
  clear: both;
`

export const StyledEmpty: any = styled(Empty)`
  margin-top: 10em;
`

export const StyledCard = styled(Card)`
  margin-top: 0;
  border: none;
`

import styled from 'styled-components'
import { Button } from 'infrad'

export const StyleDiv = styled.div`
  margin: -10px 0;
`

export const ParameterDiv = styled.div`
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 16px;

  @media (min-width: 1920px) {
    max-width: 800px;
  }
`

export const ParameterName = styled.span`
  color: #999999;
  margin-right: 8px;
`

export const ParameterValue = styled.span`
  word-break: normal;
  width: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
`

export const CollapseButton: any = styled(Button)`
  padding: 0;
  height: 16px;
`

export const CollapseDiv = styled.div`
  line-height: 1.5715;
`

export const CollapseSpan = styled.span`
  margin-right: 8px;
`

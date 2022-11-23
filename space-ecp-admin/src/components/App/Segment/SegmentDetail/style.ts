import { Tag } from 'infrad'
import styled, { css } from 'styled-components'

export const Status = styled.span`
  margin-right: 4px;
  ${(props: { color: string }) => css`
    color: ${props.color};
  `}
`

export const Title = styled.span`
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
`
export const MetaWrapper = styled.div`
  display: flex;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`

export const Meta = styled.span`
  width: 380px;
`

export const LabelTag = styled(Tag)`
  margin-left: 4px;
`

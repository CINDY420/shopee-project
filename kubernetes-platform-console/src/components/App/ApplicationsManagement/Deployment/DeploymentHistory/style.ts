import styled from 'styled-components'
import { Card, Input, Tag, Typography } from 'infrad'
const { Paragraph } = Typography

export const DeploymentHistoryWrapper = styled(Card)`
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
`
export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 48px;
`
export const Title = styled.div`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
`
export const SearchRow = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledInput = styled(Input)`
  width: 480px;
  height: 32px;
  margin-right: 16px;
`

export const DeploymentIdDiv = styled.div`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`
export const StyledParagraph = styled(Paragraph)`
  margin-bottom: 0 !important;
`

export const PhaseTag = styled(Tag)`
  margin: 4px 0;
  display: inline-block;
`

interface IStatusWrapperProps {
  direction: string
}

export const StatusWrapper = styled.div<IStatusWrapperProps>`
  display: flex;
  flex-direction: ${props => props.direction};
  height: 22px;
  align-items: ${props => (props.direction === 'row' ? 'center' : 'unset')};
`
interface ICycleProps {
  background: string
}

export const Cycle = styled.div<ICycleProps>`
  width: 6px;
  height: 6px;
  background: ${props => props.background || '#ebecf0'};
  border-radius: 50%;
  line-height: 22px;
  margin-right: 8px;
`

interface ITextWrapperProps {
  direction: string
}

export const TextWrapper = styled.div<ITextWrapperProps>`
  display: flex;
  flex-direction: ${props => props.direction};
  align-items: ${props => (props.direction === 'row' ? 'center' : 'unset')};
`

import styled from 'styled-components'
import { Card, Input, Typography, Progress, Tag } from 'infrad'
const { Paragraph } = Typography

export const TaskListWrapper = styled(Card)`
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

export const StyledTypographyText = styled(Typography.Text)`
  display: block;
  cursor: pointer;

  .ant-typography {
    margin-bottom: 0;
    display: inline-block;
  }

  .anticon-copy {
    opacity: 0;
    margin-left: 0.2em;
    transition: 0.5s;
    color: #1890ff;
  }

  &:hover .anticon-copy {
    opacity: 1;
  }
`
export const TaskNameDiv = styled.div`
  font-size: 14px;
  font-weight: 400;
`

export const StyledTag = styled(Tag)`
  margin: 4px 0;
  display: inline-block;
`
export const StyledParagraph = styled(Paragraph)`
  margin-bottom: 0 !important;
`

export const QuotaDiv = styled.div`
  color: #4A4A4A
  font-size: 14px;
  line-height: 22px;
  height: 22px;
`

export const StyledProgress = styled(Progress)`
  .ant-progress-bg {
    background-color: #1890ff !important;
  }

  .ant-progress-text {
    color: rgba(0, 0, 0, 0.45) !important;
  }
`

export const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 22px;
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

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

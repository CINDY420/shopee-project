import { Popover } from 'infrad'
import styled from 'styled-components'
import { QuestionCircleOutlined } from 'infra-design-icons'

export const Purpose = styled.span`
  white-space: wrap;
  display: inline-block;
  max-width: 310px;
`
export const Link = styled.a`
  font-size: 16px;
  font-weight: 600;
  color: #2673dd;
  text-decoration-line: underline;
  :hover,
  :visited {
    color: #2673dd;
  }
`

export const StyledContentTag = styled.span`
  color: #999;
`

export const TicketId = styled.span`
  background: #f6f6f6;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 4px 8px;
`

export const StyledPopOver = styled(Popover)`
  .ant-popover-content {
    width: 240px;

    .ant-popover-inner-content {
      color: #666666;
    }
  }
`

export const StyledQuestionCircleOutlined = styled(QuestionCircleOutlined)`
  margin-left: 5px;
  cursor: pointer;
`

export const StyledWarnSpan = styled.span`
  color: ${(props: { isMarked: boolean }) => (props.isMarked ? '#ff4a0f' : 'unset')};
`

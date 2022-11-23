import styled from 'styled-components'
import { Tag, Button } from 'infrad'

export const StyledTag = styled(Tag)`
  max-width: 160px;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const StyledButton: any = styled(Button)`
  font-weight: 500;
  line-height: 16px;

  .ant-btn {
    color: #333333;
    border: 1px solid #d8d8d8;
  }

  .ant-btn-primary {
    color: #ffffff;
  }

  & + & {
    margin-left: 16px;
  }
`

export const StyledLinkButton: any = styled(Button)`
  font-weight: 500;
  padding: 0;

  &:hover {
    color: #2673dd;
  }

  &[disabled],
  &[disabled]:hover {
    color: #999999;
  }

  span {
    max-width: 250px;
    min-width: 150px;
    word-break: break-all;
    display: block;
    white-space: pre-wrap;
    overflow: hidden;
    text-decoration: underline;

    @media (min-width: 1920px) {
      max-width: 500px;
    }
  }
`

export const StyledDiv = styled.div`
  min-width: 170px;
`

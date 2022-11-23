import styled from 'styled-components'
import { Card, Form } from 'infrad'

export const StyledCard = styled(Card)`
  .ant-card-head {
    height: 32px;
    min-height: 32px;
    background-color: #f6f6f6;
    .ant-card-head-title,
    .ant-card-extra {
      padding: 0;
      line-height: 32px;
      font-size: 14px;
    }
  }
`

export const StyledFormItem = styled(Form.Item)`
  flex-direction: column;
  .ant-col {
    min-height: auto;
  }
  .ant-form-item-label {
    text-align: left;
  }
`

export const StyledDeleteButton = styled.span`
  color: #b7b7b7;
`

export const StyledRow = styled.div`
  display: flex;
  .ant-form-item {
    width: 100%;
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  }
`

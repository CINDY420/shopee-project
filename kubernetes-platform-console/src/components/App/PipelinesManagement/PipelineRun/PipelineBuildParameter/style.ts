import styled from 'styled-components'
import { Descriptions, Tag } from 'infrad'

export const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    background: #f6f6f6;
    color: #666666;
    padding: 12px 16px;
    width: 240px;
    border-right: 1px solid #e5e5e5;
  }

  .ant-descriptions-item-content {
    color: #333333;
    padding: 4px 16px;
  }

  .ant-descriptions-row {
    border-bottom: 1px solid #e5e5e5;
  }

  .ant-descriptions-view {
    border: 1px solid #e5e5e5;
  }
`

export const StyledTag = styled(Tag)`
  color: #333333;
  margin-top: 4px;
  margin-bottom: 4px;
`

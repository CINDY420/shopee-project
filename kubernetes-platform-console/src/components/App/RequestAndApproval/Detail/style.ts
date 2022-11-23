import styled from 'styled-components'
import { Button, Descriptions } from 'infrad'

export const Container = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 28px;
`

export const StyledStatus = styled.span`
  font-size: 1.25em;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 48px;
`

export const DescriptionsContainer = styled(Descriptions)`
  width: 100%;

  & .ant-descriptions-view {
    border: 1px solid #e5e5e5;
  }

  & .ant-descriptions-row {
    border-bottom: 1px solid #e5e5e5;
  }

  & .ant-descriptions-item-label {
    width: 300px;
    background: #f6f6f6;
    color: #999999;
    border-right: 1px solid #e5e5e5;
  }

  & .ant-descriptions-item-content {
    border-right: 1px solid #e5e5e5;
    color: #333333;
  }
`

export const CancelButton = styled(Button)`
  width: 160px;
  margin: 48px 24px;
`

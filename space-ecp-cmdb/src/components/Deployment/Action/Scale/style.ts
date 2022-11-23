import styled from 'styled-components'
import { Form } from 'infrad'

export const InstancesFormItem = styled(Form.Item)`
  margin-bottom: 8px;

  .ant-form-item-control {
    display: contents;
  }
`

export const DiffInner = styled.div`
  width: 50%;

  &:first-of-type {
    margin-right: 8px;
  }
  &:last-of-type {
    margin-left: 8px;
  }
`

export const DiffContent = styled.div`
  background: #fafafa;
  padding: 20px 0;
  margin-bottom: 8px;
`

export const VersionFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const Version = styled.div`
  font-weight: 500;
  font-size: 16px;
`

export const ChangedTag = styled.span`
  color: rgba(0, 0, 0, 0.65);
  background: #d9f7be;
  padding: 2px 4px;
  border-radius: 2px;
`

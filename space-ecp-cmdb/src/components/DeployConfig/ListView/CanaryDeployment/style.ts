import { Form } from 'infrad'
import styled from 'styled-components'

export const ContentWrapper = styled.div`
  background-color: #ffffff;
  padding: 16px;
`

export const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
  .ant-input-number {
    width: 100%;
  }
`

export const HintMessage = styled.div`
  margin-left: 16px;
  color: #999999;
`

export const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
`

export const CountWrapper = styled.div`
  margin-right: 48px;
  display: flex;
`

export const TabelTitle = styled.div`
  color: '#666666';
`

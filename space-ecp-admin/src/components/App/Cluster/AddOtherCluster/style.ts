import { Steps } from 'infrad'
import styled from 'styled-components'

export const Root = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: calc(100% - 64px);
`

export const StyledSteps = styled(Steps)`
  width: 70%;
  margin: 16px 0 16px 0;

  .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background: #d9d9d9;
  }
`

export const FormWrapper = styled.div`
  width: 100%;
  background: #fff;
  padding: 24px;
  margin-top: 16px;
  max-height: 100%;
  overflow: auto;
`

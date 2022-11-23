import styled from 'styled-components'
import { Steps, Form } from 'infrad'

const { Step } = Steps
export const StyledRoot = styled.div`
  height: 100%;
`
export const StyledSteps = styled(Steps)`
  padding: 51px 252px;
`

export const StyledStep = styled(Step)`
  .ant-steps-item-title {
    font-weight: normal;
  }
`

export const StyledForm = styled(Form)`
  min-height: calc(100% - 214px);
`

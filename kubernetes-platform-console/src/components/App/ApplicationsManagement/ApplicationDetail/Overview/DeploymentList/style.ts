import styled from 'styled-components'
import RespondSvg from 'assets/respond.svg'
import { Button, Progress } from 'infrad'
import { LoadingOutlined } from 'infra-design-icons'

export const PodProgress = styled(Progress)`
  .ant-progress-inner {
    border-radius: 0 !important;
  }
`

export const PodStatus = styled.div`
  width: 100px;
`

export const StatusTextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888888;
`

interface IStatusTextProps {
  textAlign?: string
}

export const StatusText = styled.div<IStatusTextProps>`
  color: #4a4a4a;
  font-size: 16px;
  text-align: ${props => props.textAlign};
`

export const OperationWrapper = styled.div`
  display: flex;
`

export const Operation: any = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;
`

interface IBatchOperation {
  disabled: boolean
}

export const BatchOperation = styled.span<IBatchOperation>`
  color: ${props => (props.disabled ? '#E8E8E8' : '#333333')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`

const Icon: any = styled.span`
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 7px;
`

interface IProps {
  disabled?: boolean
}

export const RespondIcon = styled(Icon)<IProps>`
  background-color: ${props => (props.disabled ? 'rgba(0, 0, 0, 0.25)' : '#1890ff')};
  mask-image: url(${RespondSvg});
`

export const Filters = styled.div`
  width: 100%;
`

export const OperationsWrapper = styled.div`
  float: right;
  display: flex;
`

export const OperationItem = styled.div`
  margin-left: 8px;
`

export const StyledTagSpinIcon = styled(LoadingOutlined)`
  font-size: 15px;
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.25);
`

export const Text = styled.div`
  font-size: 8px;
  color: rgba(0, 0, 0, 0.25);
`

export const NoWrapDiv = styled.div`
  white-space: nowrap;
`

interface ILabelText {
  lineHeight?: string
}
export const LabelText = styled.span<ILabelText>`
  font-size: 12px;
  line-height: ${props => props.lineHeight};
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
`

export const FlexDiv = styled.div`
  display: flex;
`

export const PhaseContainer = styled.div`
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
`

export const PhaseWrapper = styled.span`
  background-color: #fafafa;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  white-space: nowrap;
  cursor: default;
`

export const SplitLine = styled.div`
  display: inline-block;
  width: 1px;
  height: 16px;
  background-color: #000000;
  margin: 0 8px;
  vertical-align: text-bottom;
`

export const CircleText = styled.div`
  display: inline-block;
  height: 16px;
  border-radius: 50%;
  padding: 0 5px;
  background-color: #ff4d4f;
  color: #ffffff;
  line-height: 16px;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
`

export const BorderedLink = styled.a`
  display: inline-block;
  line-height: 32px;
  text-align: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
`

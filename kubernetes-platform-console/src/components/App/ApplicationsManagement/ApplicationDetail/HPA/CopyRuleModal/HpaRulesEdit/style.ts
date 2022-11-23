import styled from 'styled-components'
import { Switch, Divider } from 'infrad'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const DeploymentWrapper = styled.div`
  width: 299px;
  border: 1px solid #f0f0f0;
  index: 20;
`

export const Header = styled.div`
  background: #fafafa;
  width: 299px;
  height: 40px;
  font-weight: 400;
  font-size: 14px;
  padding: 9px 16px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
`

interface IDeploymentItemProps {
  isSelectedDeployment: boolean
}

export const DeploymentItem = styled.div<IDeploymentItemProps>`
  width: 299px;
  height: 40px;
  padding-left: 16px;
  font-size: 14px;
  line-height: 40px;
  background: ${(props: IDeploymentItemProps) => (props.isSelectedDeployment ? '#F0F9FF' : '#FFFFFF')};
  color: ${(props: IDeploymentItemProps) => (props.isSelectedDeployment ? '#2673DD' : '#000000')};
`

export const HpaDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const RulesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`
export const Title = styled.div`
  margin-top: 10px;
  font-weight: 500;
  font-size: 16px;
`

export const AutoscalingRulesWrapper = styled.div`
  margin-left: 64px;
  margin-top: 24px;
  width: 480px;
`

export const CronRulesWrapper = styled.div`
  margin-left: 64px;
  margin-top: 24px;
  width: 480px;
`
export const StyledDivider = styled(Divider)`
  width: auto;
  margin-left: 24px;
  margin-right: 24px;
`
export const ThresholdWrapper = styled.div`
  margin-left: 24px;
`
export const ScaleDirectionWrapper = styled.div`
  margin-left: 24px;
`

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`

export const StyledSwitch = styled(Switch)`
  margin-left: 20px;
  margin-top: 8px;
  width: 52px;
`

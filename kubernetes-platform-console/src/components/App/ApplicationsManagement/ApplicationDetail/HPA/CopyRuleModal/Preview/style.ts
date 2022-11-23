import styled from 'styled-components'
import { Switch } from 'infrad'

export const ContentWrapper = styled.div`
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
  width: 653px;
  margin-left: 24px;
  background: #fafafa;
  padding-bottom: 24px;
`
export const Title = styled.div`
  margin-top: 24px;
  font-weight: 500;
  font-size: 16px;
  margin-left: 24px;
`

export const ThresholdWrapper = styled.div`
  margin-left: 24px;
  margin-top: 24px;
  background: #fafafa;
  padding-bottom: 24px;
`

export const ScaleDirectionWrapper = styled.div`
  margin-left: 24px;
  margin-top: 24px;
  background: #fafafa;
  padding-bottom: 24px;
`

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledSwitch = styled(Switch)`
  margin-left: 20px;
  margin-top: 8px;
  width: 52px;
`

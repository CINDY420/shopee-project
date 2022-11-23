import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const AutoscalingRulesWrapper = styled.div`
  width: 380px;
`
export const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
`
export const TriggerLogicWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
`
interface ITriggerLogicItemProps {
  isSelected: boolean
}

export const TriggerLogicItem = styled.div<ITriggerLogicItemProps>`
  color: ${(props: ITriggerLogicItemProps) => (props.isSelected ? '#333333' : '#999999')};
`

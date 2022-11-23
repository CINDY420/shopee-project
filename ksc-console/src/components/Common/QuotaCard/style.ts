import styled from 'styled-components'
import { Card, Progress } from 'infrad'

export const StyledCard = styled(Card)`
  min-width: 450px;
`
export const StyledTitle = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 22px;
`

interface IProgressProps {
  background?: string
  successbackground?: string
}
export const StyledProgress = styled(Progress)`
  height: 16px;
  .ant-progress-inner,
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0 !important;
    height: 15px !important;
  }

  .ant-progress-bg {
    background-color: ${(props: IProgressProps) => props.background || '#cfe9ff'};
  }
  .ant-progress-success-bg {
    background-color: ${(props: IProgressProps) => props.successbackground || '#2673dd'};
  }
`
interface ICycleProps {
  background?: string
}

export const StyledLabelWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow-x: scroll;
  overflow-y: hidden;
`
export const StyledLabelItem = styled.div`
  width: calc(100% / 3);
  display: flex;
`
export const StyledCycle = styled.div`
  margin-top: 4px;
  width: 8px;
  height: 8px;
  background: ${(props: ICycleProps) => props.background || '#ebecf0'};
  border-radius: 50%;
`

export const StyledQuotaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const StyledQuotaName = styled.div`
  height: 16px;
  font-size: 14px;
  line-height: 16px;
`
export const StyledQuotaValueWrapper = styled.div`
  display: flex;
  line-height: 22px;
  flex-direction: row;
`
export const StyledQuotaValue = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 22px;
`
export const StyledQuotaUnit = styled.div`
  align-self: flex-end;
  font-size: 12px;
  line-height: 16px;
  color: #999999;
`

export const StyledCenterWrapper = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledHead = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledTotal = styled.div`
  margin-right: 8px;
  font-size: 14px;
  line-height: 22px;
`

export const StyledOthersValue = styled.div`
  padding-left: 16px;
  font-size: 12px;
  color: #bfbfbf;
`

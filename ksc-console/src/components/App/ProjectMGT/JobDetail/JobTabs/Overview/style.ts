import styled from 'styled-components'
import { Card } from 'infrad'

export const OverviewWrapper = styled(Card)`
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  height: 144px;

  .ant-card-body {
    padding: 24px;
  }
`
export const Title = styled.div`
  color: #333333;
  font-size: 20px;
  line-height: 22px;
  font-weight: 500;
`
export const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
interface IBarItemProps {
  width?: string
  height?: string
  backgroundColor?: string
}

export const BarItem = styled.div<IBarItemProps>`
  width: ${(props: IBarItemProps) => props.width || '0%'};
  height: 16px;
  background: ${(props: IBarItemProps) => props.backgroundColor || 'inherit'};
  min-width: 32px;
`

export const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
`
interface ILabelItemProps {
  width?: string
  height?: string
  backgroundColor?: string
}

export const LabelItem = styled.div<ILabelItemProps>`
  display: flex;
  width: ${(props: IBarItemProps) => props.width || '0%'};
  height: 22px;
  background?: ${(props: IBarItemProps) => props.backgroundColor || 'inherit'};
  min-width: 32px;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

interface ICycleProps {
  background?: string
  size?: string
}

export const Cycle = styled.div<ICycleProps>`
  width: 8px;
  height: 8px;
  background: ${(props: ICycleProps) => props.background || '#ebecf0'};
  border-radius: 50%;
  line-height: 8px;
`
export const Status = styled.div`
  height: 16px;
  font-size: 14px;
  line-height: 16px;
`
export const QuotaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 22px;
  font-weight: 500;
  font-size: 20px;
  line-height: 22px;
`
export const Quota = styled.div`
  height: 22px;
  font-weight: 500;
  font-size: 20px;
  line-height: 22px;
`
export const Unit = styled.div`
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  align-self: flex-end;
  color: #333333;
  padding-bottom: 4px;
`

import styled from 'styled-components'

export const StyledStep: any = styled.div`
  min-height: 22px;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }
`

export const StyledMainDetail: any = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props: any) => props.cursor || 'default'};
`

export const StyledContent = styled.div`
  display: flex;
  align-items: center;
`

export const StyledStatus = styled.div`
  font-size: 22px;
`

export const StyledDetail = styled.div`
  margin-left: 10px;
`

export const StyledName: any = styled.div`
  color: ${(props: any) => props.color || '#333333'};
  font-weight: ${(props: any) => props.fontWeight || '400'};
`

export const StyledDurationTitle = styled.span`
  font-size: 12px;
  color: #999999;
`

export const StyledDuration = styled.span`
  font-size: 12px;
  color: #333333;
`

export const StyledArrow = styled.div`
  color: #999999;
`

export const StyledSubSteps = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledSubStep = styled.div`
  .ant-divider-vertical {
    border-left: 1px solid #b7b7b7;
    margin: 0 10px 0 42px;
  }

  &:last-child {
    .ant-divider {
      display: none;
    }
  }
`

export const StyledSubStepItem: any = styled.div`
  cursor: pointer;
  background-color: ${(props: any) => props.bgColor || 'transparent'};
  padding: 10px 20px 10px 32px;
`

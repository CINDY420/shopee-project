import styled from 'styled-components'
import { Card } from 'infrad'

export const StyledCard = styled(Card)`
  margin-top: 24px;
  border: 1px solid #e5e5e5;

  .ant-card-head {
    background: #f6f6f6;
    color: #666666;
    font-weight: 400;
    min-height: 40px;
    padding: 0 16px;
    font-size: 14px;
    border-bottom: 1px solid #e5e5e5;

    .ant-card-head-title {
      padding: 12px 0;
    }
  }

  .ant-card-body {
    padding: 0;
  }
`

export const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  min-height: 200px;

  .ant-spin,
  .ant-empty-normal {
    align-self: center;
  }
`

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 4px;

  .anticon {
    width: 30px;
    height: 30px;
    font-size: 14px;
    border-radius: 50%;
    color: #fafafa;
    background: rgba(255, 255, 255, 0.4);
    line-height: 35px;
    cursor: pointer;
  }
`

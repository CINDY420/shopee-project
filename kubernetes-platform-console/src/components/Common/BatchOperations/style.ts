import styled from 'styled-components'
import { primary } from 'constants/colors'

interface IRootProps {
  visible?: boolean
}

export const Root = styled.div<IRootProps>`
  width: 100%;
  height: ${props => (props.visible ? '80px' : 0)};
  transition: 0.15s;
  background: #fff;
  box-shadow: 0px -1px 4px rgba(74, 74, 78, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
  padding-left: 280px;
  overflow: hidden;
`

export const Title = styled.div`
  color: #333;
  font-weight: 500;
  font-size: 16px;
  margin-right: 16px;
`

export const Desc = styled.div`
  font-size: 12px;
  color: #999;
`

export const Count = styled.span`
  color: #999;
  margin-right: 8px;

  & span {
    color: ${primary};
    font-size: 16px;
  }
`

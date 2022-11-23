import styled from 'styled-components'
import { Space, Spin } from 'infrad'

export const StyledSpace = styled(Space)`
  display: flex;
  height: 100%;

  .ant-space-item:last-child {
    flex: 1;
  }
`

export const ContentPanel = styled.div`
  background-color: #333333;
  color: white;
  min-height: 790px;
  height: 100%;
`

export const ContentCode = styled.div`
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 20px;
`

export const StyledSpin = styled(Spin)`
  position: absolute;
  top: 20%;
  left: 50%;
`

const Arrow = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  right: 40px;
  text-align: center;
  line-height: 30px;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
`

export const DownArrow = styled(Arrow)`
  top: 65px;
`

export const UpArrow = styled(Arrow)`
  bottom: 17px;
`

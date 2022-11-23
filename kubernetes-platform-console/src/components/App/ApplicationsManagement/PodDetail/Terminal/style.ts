import styled from 'styled-components'

interface IRootProps {
  isFullScreen?: boolean
}

export const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  padding: ${(props: IRootProps) => (props.isFullScreen ? 0 : '2em')};
`

export const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`

export const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
`

export const StyledFullScreenHeader = styled.div`
  height: 50px;
  text-align: center;
  color: #fff;
  line-height: 40px;
  font-size: 16px;
  background: linear-gradient(to bottom, #505050, #000);
`

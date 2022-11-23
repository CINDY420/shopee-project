import styled, { keyframes, css } from 'styled-components'

const OPACITY = {
  LOW: 0,
  HIGH: 1
}

const ZINDEX = {
  LOW: -1,
  HIGH: 10
}

const SlideIn = keyframes`
  0% {
    opacity: ${OPACITY.LOW};
    z-index: ${ZINDEX.LOW};
  }
  100% {
    opacity: ${OPACITY.HIGH};
    z-index: ${ZINDEX.HIGH};
  }
`

const SlideOut = keyframes`
  0% {
    opacity: ${OPACITY.HIGH};
    z-index: ${ZINDEX.HIGH};
  }
  100% {
    opacity: ${OPACITY.LOW};
    z-index: ${ZINDEX.LOW};
  }
`

const animationShow = css`
  ${SlideIn} 0.5s ease-in-out;
`

const animationClose = css`
  ${SlideOut} 0.5s ease-in-out;
`

interface IRootProps {
  show: boolean
  isCloseClicked: boolean
}

export const Root = styled.div`
  height: 3em;
  padding: 0 0.5em;
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: rows;
  align-items: center;
  position: absolute;
  top: 0;
  right: 20px;
  opacity: ${(props: IRootProps) => (props.show ? OPACITY.HIGH : OPACITY.LOW)};
  z-index: ${(props: IRootProps) => (props.show ? ZINDEX.HIGH : ZINDEX.LOW)};
  animation: ${(props: IRootProps) => (props.show ? animationShow : props.isCloseClicked ? animationClose : 'none')};
`

export const Input = styled.input`
  width: 10em;
  outline-style: none;
  border: none;
  border-radius: 2px;
`

export const Operations = styled.div`
  display: flex;
`

export const OperationIcon = styled.div`
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
  }
`

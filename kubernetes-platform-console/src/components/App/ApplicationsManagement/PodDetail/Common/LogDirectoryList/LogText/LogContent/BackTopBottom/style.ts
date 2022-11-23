import styled from 'styled-components'

export const Root = styled.div`
  position: absolute;
  right: 4em;
  bottom: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  cursor: pointer;
`

export const IconToTop = styled.div`
  width: 2em;
  height: 2em;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  & .anticon {
    color: #fff;
  }

  &:last-child {
    margin-left: 12px;
  }
`

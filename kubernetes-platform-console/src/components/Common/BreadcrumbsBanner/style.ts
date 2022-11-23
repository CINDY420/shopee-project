import styled from 'styled-components'

interface IName {
  isActive?: boolean
}

export const Root = styled.div`
  width: 100%;
  padding: 1em 0;
  font-size: 12px;
  box-sizing: border-box;
  height: 45px;
`

export const Crumb = styled.div`
  display: flex;
  align-items: center;
`

export const Name = styled.div`
  font-weight: normal;
  cursor: ${(props: IName) => (props.isActive ? 'pointer' : 'default')};
  color: ${(props: IName) => (props.isActive ? 'rgba(0, 0, 0, 0.45)' : '#4a4a4a')};

  &:hover {
    color: ${(props: IName) => (props.isActive ? '#4a90e2' : '#4a4a4a')};
  }
`

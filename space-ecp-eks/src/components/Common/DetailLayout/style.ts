import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`
interface IHeaderProps {
  hasTabs: boolean
}

export const Header = styled.div`
  background-color: #ffffff;
  box-shadow: 0 -1px 0px 0 #f0f0f0;
  padding-bottom: ${(props: IHeaderProps) => !props.hasTabs && '16px'};
`

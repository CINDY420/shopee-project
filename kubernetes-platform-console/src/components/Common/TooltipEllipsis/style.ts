import styled from 'styled-components'

interface IContainer {
  maxWidth: string
  largeScreenMaxWidth: string
}

export const Container = styled.div`
  max-width: ${(props: IContainer) => props.maxWidth || '200px'};
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 1920px) {
    max-width: ${(props: IContainer) => props.largeScreenMaxWidth || props.maxWidth || '200px'};
  }
`

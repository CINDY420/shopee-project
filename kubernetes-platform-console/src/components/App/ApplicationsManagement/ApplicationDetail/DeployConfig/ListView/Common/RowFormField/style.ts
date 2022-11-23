import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  :not(:last-child) {
    margin-bottom: 24px;
  }
`

export const Key = styled.div`
  width: 11%;
  text-align: right;
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

interface IContentProps {
  width?: string
  hasBackground?: boolean
}

export const Content = styled.div`
  background: ${(props: IContentProps) => (props.hasBackground ? '#ffffff' : 'unset')};
  width: ${(props: IContentProps) => props.width};
  padding: ${(props: IContentProps) => (props.hasBackground ? '16px' : 'unset')};
`

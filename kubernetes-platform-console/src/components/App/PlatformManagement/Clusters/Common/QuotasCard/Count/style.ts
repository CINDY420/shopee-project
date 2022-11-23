import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  align-items: baseline;
  flex-grow: 1;
`

export const Circle: any = styled.div`
  background: ${(props: any) => props.color || '#eee'};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
`

export const Desc: any = styled.div`
  font-size: 0.8em;
  color: #999;
  margin-top: ${(props: any) => props.top || '0.2em'};
  white-space: nowrap;
`

export const StyleCount = styled.div`
  margin-top: 0.2em;
  font-weight: 500;
  font-size: 1.4em;

  span {
    font-size: 0.7em;
    font-weight: 400;
    margin-left: 0.3em;
  }
`

export const Name = styled.div``

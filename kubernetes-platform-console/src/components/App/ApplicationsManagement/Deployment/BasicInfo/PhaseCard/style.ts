import styled from 'styled-components'

export const Root = styled.div`
  padding: 16px;
  margin-top: 8px;
  background: #fcfcfc;
`

interface IItemProps {
  alignItems?: string
}

export const Item = styled.div`
  color: #333;
  font-size: 14px;
  word-break: break-all;
  margin-bottom: 16px;
  line-height: 1;
  display: flex;
  align-items: ${(props: IItemProps) => props.alignItems || 'baseline'};

  &:last-of-type {
    margin-bottom: 0;
  }

  & span {
    font-size: 12px;
    color: #999;
    margin-right: 3px;
    display: inline-block;
  }
`

export const CardRoot = styled.div`
  flex: 1;
`

export const CardTitle = styled.div`
  margin-bottom: 8px;
`

export const CardWrap = styled.div`
  width: calc(50% - 8px);
  display: inline-block;

  &:nth-of-type(2n + 1) {
    margin-right: 16px;
  }
`

import styled from 'styled-components'
import { Button } from 'infrad'

export const Root = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`

interface IHeaderProps {
  isHeaderWithBottomLine?: boolean
}

export const Header = styled.div<IHeaderProps>`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(74, 74, 78, 0.16);
  padding: 0 24px;
  border-bottom: ${props => (props.isHeaderWithBottomLine ? '1px solid #f0f0f0' : 'none')};
`

export const HeaderBody = styled.div`
  display: flex;
  align-items: center;
`

export const State: any = styled.h2`
  color: ${(props: any) => props.color || '#6FC9CA'};
  font-size: 32px;
  margin-right: 10px;
  margin-bottom: 0px;
`

export const Title: any = styled.h2`
  font-size: 32px;
  margin-right: 10px;
  margin-bottom: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  min-width: 160px;
`

export const TagsWrapper = styled.div`
  min-height: 50px;
  vertical-align: bottom;
  flex-grow: 1;
  padding-top: 15px;
  white-space: nowrap;
  display: flex;
  flex-wrap: wrap;
`

export const Tag = styled.div`
  display: inline-block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 0px 5px;
  margin-left: 10px;
  max-width: 320px;
  height: 23px;
  line-height: 23px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const StyledButton: any = styled(Button)`
  border: none;
  box-shadow: none;
  color: #2673dd;
  font-size: 14px;
  padding-left: 24px;
  padding-right: 0px;
  align-items: center;
  display: flex;

  &[disabled],
  &[disabled]:hover {
    background: transparent;
  }
`

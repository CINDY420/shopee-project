import styled from 'styled-components'
import { Button } from 'infrad'

export const StyledRoot = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

interface IHeaderProps {
  isHeaderWithBottomLine: boolean
  isHeaderWithBreadcrumbs: boolean
}

export const StyledHeader = styled.div<IHeaderProps>`
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(74, 74, 78, 0.16);
  padding: 0 24px;
  padding-bottom: 24px;
  padding-top: ${(props: IHeaderProps) => (props.isHeaderWithBreadcrumbs ? '0' : '24px')};
  border-bottom: ${(props: IHeaderProps) =>
    props.isHeaderWithBottomLine ? '1px solid #f0f0f0' : 'none'};
`
export const StyledHeaderBody = styled.div`
  display: flex;
  align-items: center;
`

export const StyledTitle = styled.div`
  font-size: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  font-weight: bold;
  font-size: 26px;
  line-height: 28px;
`
export const StyledTagsWrapper = styled.div`
  vertical-align: bottom;
  flex-grow: 1;
  white-space: nowrap;
  display: flex;
  flex-wrap: wrap;
  padding: 3px 0;
`
export const StyledTag = styled.div`
  display: inline-block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 0px 8px;
  margin-left: 8px;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 20px;
`
export const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
`

export const StyledButton = styled(Button)`
  border: none;
  box-shadow: none;
  color: #2673dd;
  font-size: 14px;
  align-items: center;
  display: flex;

  &[disabled],
  &[disabled]:hover {
    background: transparent;
  }

  &[ant-click-animating-without-extra-node]:after {
    border: 0 none;
    opacity: 0;
    animation:none 0 ease 0 1 normal;
`

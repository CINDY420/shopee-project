import styled from 'styled-components'
import { Menu, Button } from 'infrad'

import LogoImg from 'assets/k8s_logo.svg'
import { HorizonCenterWrapper } from 'common-styles/flexWrapper'

interface IHeaderWrapperProps {
  justifyContent: string
}

export const HeaderWrapper = styled(HorizonCenterWrapper)<IHeaderWrapperProps>`
  height: 100%;
  background-color: #272d37;
  color: rgba(255, 255, 255, 1);
  padding: 0 16px;
  justify-content: ${(props: any) => props.justifyContent};
`

export const TitleWrapper = styled(HorizonCenterWrapper)`
  flex-grow: 0;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 1);
`

export const TitleIcon = styled.div`
  width: 32px;
  height: 32px;
  background-image: url(${LogoImg});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`

export const Title = styled.p`
  height: 32px;
  font-size: 18px;
  line-height: 32px;
  margin: 0;
`

export const MenuWrapper = styled(HorizonCenterWrapper)`
  flex-grow: 1;
`
export const HeaderMenu = styled(Menu)`
  background: inherit;
  color: rgba(255, 255, 255, 0.5);

  &.ant-menu-dark .ant-menu-item:hover,
  .ant-menu-item-selected {
    background: inherit;
  }

  &.ant-menu-dark {
    background: inherit;
  }

  &.ant-menu-dark .ant-menu-item-selected {
    background: inherit;
  }

  &.ant-menu-dark .ant-menu-item.ant-menu-item-selected a {
    color: rgba(255, 255, 255, 1);
  }

  &.ant-menu-dark .ant-menu-item a {
    color: rgba(255, 255, 255, 0.5);
  }
`

export const SearchWrapper = styled(HorizonCenterWrapper)`
  justify-content: flex-start;
  width: 480px;
  line-height: 100%;

  .ant-select .ant-select-selector,
  .ant-select:hover .ant-select-selector {
    background: rgba(255, 255, 255, 0.1);
    border-width: 0 !important;
    color: rgba(255, 255, 255, 1);
  }

  .ant-select-selection__placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .ant-select-arrow {
    color: rgba(255, 255, 255, 0.3);
  }
`
export const LogoWrapper = styled(HorizonCenterWrapper)`
  cursor: pointer;
`

export const ActionWrapper = styled(HorizonCenterWrapper)`
  cursor: pointer;
`

export const HubButton: any = styled(Button)`
  background-color: inherit;
  border: 1px solid rgba(220, 220, 224, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: inherit;
    border: 1px solid rgba(220, 220, 224, 1);
    color: rgba(255, 255, 255, 1);
  }
`

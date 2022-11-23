import styled from 'styled-components'
import { Layout as AntdLayout } from 'infrad'

const { Header: AntdHeader, Content: AntdContent } = AntdLayout

export const StyledLayout = styled(AntdLayout)`
  min-height: 100vh !important;
  min-width: 1336px;
  height: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const StyledHeader = styled(AntdHeader)`
  width: 100%;
  height: '56px';
  line-height: '56px';
  padding: 0;
  color: #f5f5f5;
`
export const StyledContentLayout = styled(AntdLayout)`
  height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: row;
`
export const StyledSider = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: #fff;
`
export const PageWrapper = styled(AntdContent)`
  width: 100%;
  /* min-width: 800px; */
  height: 100%;
  overflow: hidden;
`

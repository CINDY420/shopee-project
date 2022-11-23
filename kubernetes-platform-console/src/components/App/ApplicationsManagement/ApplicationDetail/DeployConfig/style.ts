import styled from 'styled-components'
import { Form, Button, Modal, Row, Tabs } from 'infrad'

export const Root = styled.div`
  padding: 24px;
  padding-bottom: 0;
  background-color: #fff;
  height: calc(100% + 24px);
  overflow-y: scroll;
`

export const SelectWrapper = styled.div`
  min-width: 20em;
  display: flex;
  align-items: center;
  margin-left: 1em;

  > span {
    margin-right: 0.3em;
  }
`

export const StyledTabs = styled(Tabs)`
  .ant-tabs-content-holder {
    position: inherit !important;
    border-top: 1px solid #eee;
    min-height: 550px;
  }
`

export const StyledTabPan = styled(Tabs.TabPane)`
  padding: 48px 16px 32px 32px;
`

export const ContentWrap = styled.div`
  padding: 0;
`

export const VersionWrap = styled.div`
  background: #f6f6f6;
  height: 64px;
  align-items: center;
  margin-bottom: 32px;
  display: flex;
  padding-right: 2em;

  & > div {
    margin-bottom: 0;
  }
`

export const StyledRow = styled(Row)`
  box-sizing: border-box;
  width: calc(100% + 48px);
  margin-left: -24px !important;
  left: 8px;
  bottom: 0;
  position: sticky;
  background-color: white;
  z-index: 100;
  box-shadow: 0px -2px 6px 0px #0000001f;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
`

export const CommentFormItem = styled(Form.Item)`
  .ant-form-item-explain.ant-form-item-explain-error {
    display: none;
  }
`
export const StyledModal = styled(Modal)`
  height: calc(100vh - 200px);
  .ant-modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`

export const StyledButton = styled(Button)`
  width: 300px;
  height: 50px;
`

export const CenterTextWrapper = styled.div`
  text-align: center;
`

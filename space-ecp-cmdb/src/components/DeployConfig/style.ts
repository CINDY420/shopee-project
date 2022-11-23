import styled from 'styled-components'
import { Form, Button, Modal, Row, List } from 'infrad'

interface IVersionListProps {
  $isEditing?: boolean
}

export const Root = styled.div`
  padding: 24px;
  padding-bottom: 0;
  background-color: #fff;
  height: calc(100% + 24px);
  /* you need this when outer container is not scrolling */
  overflow-y: scroll;
`

export const ContentWrap = styled.div`
  padding: 0;
`

export const StyledRow = styled(Row)`
  box-sizing: border-box;
  width: calc(100% + 48px);
  margin-left: -24px !important;
  left: 8px;
  bottom: 0;
  position: fixed;
  background-color: white;
  z-index: 100;
  box-shadow: 0px -2px 6px 0px #0000001f;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
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

export const VersionList = styled(List)<IVersionListProps>`
  .ant-list-header {
    background-color: #fafafa;
    color: rgba(0, 0, 0, 0.45);
  }
  margin-right: 16px;
  overflow-y: scroll;

  .ant-list-item {
    width: 100%;
    display: inline-block;
    opacity: ${(props) => (props.$isEditing ? 0.5 : 1)};
    pointer-events: ${(props) => (props.$isEditing ? 'none' : 'auto')};
    cursor: ${(props) => (props.$isEditing ? 'not-allowed' : 'pointer')};
  }
  .ant-list-item-meta-title {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }

  .ant-list-item-meta-description {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
`

export const CommitTitle = styled.div`
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  margin-bottom: 6px;
`

export const Title = styled.div`
  color: #000000;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-left: 6px;
  margin-bottom: 16px;
`

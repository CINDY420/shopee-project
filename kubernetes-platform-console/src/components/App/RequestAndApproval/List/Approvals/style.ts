import styled from 'styled-components'
import { Tabs, Button } from 'infrad'

export const StyledTabs = styled(Tabs)`
  height: calc(100% - 84px);
  position: relative;

  & .ant-tabs-bar {
    margin-bottom: 0;
    padding: 0 2em;
  }

  & .ant-tabs-content-holder {
    height: 100%;
    overflow: auto;
  }

  & .ant-tabs-tab-btn {
    padding: 0px 16px;
    text-align: center;
  }
`

export const ActionButton: any = styled(Button)`
  font-weight: 500;
  font-size: 0.875em;
`

export const ApproveButton = styled(ActionButton)`
  background: #2673dd;
`

export const StyledDiv = styled.div`
  min-width: 170px;
  max-width: 200px;
  display: flex;
  justify-content: space-around;
`

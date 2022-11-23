import styled from 'styled-components'
import { Tabs } from 'infrad'

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

export const StyledActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`

export const TicketStageFilterWrapper = styled.div`
  margin-right: 24px;
  margin-bottom: 24px;
  margin-top: 22px;
`

export const StyledSpan = styled.span`
  color: ${(props: { isChcked: boolean }) => (props.isChcked ? 'unset' : '#b7b7b7')};
`

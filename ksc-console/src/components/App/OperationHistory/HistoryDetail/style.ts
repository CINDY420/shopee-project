import styled from 'styled-components'
import { Card, Tabs } from 'infrad'
const { TabPane } = Tabs

export const StyledRoot = styled.div`
  padding-top: 20px;
`
export const StyleCard = styled(Card)`
  .ant-card-head {
    min-height: 1px;
    border: none;
    .ant-card-head-title {
      padding: 0;
    }
  }
`
export const StyleRow = styled.div`
  display: flex;
  width: 100%;
  min-height: 48px;
  line-height: 48px;
  font-size: 14px;
`

export const StyleColKey = styled.div`
  width: 160px;
  margin-right: 24px;
  text-align: right;
  color: #999999;
`

export const StyleColValue = styled.div`
  width: calc(100% - 260px);
`

export const StyleTabs = styled(Tabs)`
  margin-top: 17px;
`

export const StyleTabPane = styled(TabPane)`
  max-height: 400px;
  padding: 0 24px;
  overflow: scroll;
`

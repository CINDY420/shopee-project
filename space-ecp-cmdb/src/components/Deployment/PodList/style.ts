import styled from 'styled-components'
import { Progress } from 'infrad'

export const PodMeta = styled.div`
  & > div:first-child {
    font-weight: 500;
    margin-bottom: 8px;
  }

  & > div:not(:first-child) {
    color: #999;
    & + & {
      margin-top: 4px;
    }

    .ant-typography {
      color: #333;
      display: inline-block;
      margin-bottom: 0;
      white-space: nowrap;

      .anticon-copy {
        opacity: 0;
        margin-left: 0.2em;
        transition: 0.5s;
        color: #1890ff;
      }
    }

    &:hover .anticon-copy {
      opacity: 1;
    }
  }
`

export const IpTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
`

export const QuotaDiv = styled.div`
  color: #4a4a4a;
  font-size: 14px;
  line-height: 22px;
  height: 22px;
`

export const StyledProgress = styled(Progress)`
  .ant-progress-bg {
    background-color: #1890ff !important;
  }

  .ant-progress-text {
    color: rgba(0, 0, 0, 0.45) !important;
  }
`

import styled from 'styled-components'

export const PodMeta = styled.div`
  & > div:first-child {
    margin-bottom: 8px;
  }

  & > div:not(:first-child) {
    color: #999;
    white-space: nowrap;
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

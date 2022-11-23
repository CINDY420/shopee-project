import styled from 'styled-components'
import { Button } from 'infrad'

export const Root = styled.div`
  margin-bottom: 24px;
  height: 100%;
  overflow: auto;

  .ant-table-pagination.ant-pagination {
    margin: 24px 0;
  }
`

export const StyledButton: any = styled(Button)`
  font-weight: 500;
  line-height: 16px;

  .ant-btn {
    color: #333333;
    border: 1px solid #d8d8d8;
  }

  .ant-btn-primary {
    color: #ffffff;
  }

  & {
    margin-left: 16px;
  }
`

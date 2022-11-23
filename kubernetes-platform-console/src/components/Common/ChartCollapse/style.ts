import styled from 'styled-components'
import { Collapse, Button } from 'infrad'

export const CollapseButton: any = styled(Button)`
  width: 32px;
  height: 32px;
  .anticon {
    font-size: 10px;
    height: 10px;
    font-weight: bold;
  }
`

export const StyledCollapse: any = styled(Collapse)`
  .ant-collapse-header {
    font-size: 16px;

    .ant-collapse-arrow {
      z-index: 10;
    }
  }
  .ant-collapse-content-box {
    margin-top: -56px;
  }
`

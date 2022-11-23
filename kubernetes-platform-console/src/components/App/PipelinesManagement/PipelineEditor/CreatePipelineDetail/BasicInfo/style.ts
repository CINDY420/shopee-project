import styled from 'styled-components'
import { Drawer, Form, Tooltip, Typography } from 'infrad'
const { Title } = Typography

export const StyledDrawer: any = styled(Drawer)`
  .ant-drawer-title {
    font-size: 20px;
  }
`
export const StyledTitle = styled(Title)`
  margin-bottom: 24px !important;
  font-size: 22px !important;
`
export const StyledConfig = styled(Title)`
  padding-top: 32px !important;
  margin-top: 64px !important;
  margin-bottom: 24px !important;
  font-size: 22px !important;
  border-top: 1px solid #e5e5e5;
`
export const StyledForm: any = styled(Form)`
  padding-bottom: 32px;
  margin-bottom: 32px;

  .ant-form-item-label label {
    font-size: 16px;
    /* font-weight: 500; */
  }

  .ant-form-item-extra {
    font-size: 12px;
  }

  .none-resize {
    resize: none;
  }

  .ant-form-item {
    margin-bottom: 32px;
  }
`

export const StyledTooltip = styled(Tooltip)``

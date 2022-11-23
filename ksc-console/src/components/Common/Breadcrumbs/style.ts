import styled from 'styled-components'
import { Breadcrumb } from 'infrad'

interface IStyledBreadcrumbProps {
  visible: string
}

export const StyledBreadcrumb = styled(Breadcrumb)`
  margin-top: 16px;
  margin-bottom: 16px;
  visibility: ${(props: IStyledBreadcrumbProps) => props.visible};
  .ant-dropdown-trigger .anticon {
    font-size: 12px;
  }
`

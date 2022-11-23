import { Card } from 'infrad'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0;
    border-bottom: none;
    & .ant-card-head-title {
      padding-top: 0;
    }
  }
  & > .ant-card-body {
    padding: 0 24px 24px 0;
  }
`

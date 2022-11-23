import { Descriptions } from 'infrad'
import styled from 'styled-components'

export const StyledDescriptions = styled(Descriptions)`
  width: 300px;

  .ant-descriptions-item-container .ant-descriptions-item-label {
    text-align: left;
    min-width: 119px;
    justify-content: flex-start;
  }

  .ant-descriptions-item-content {
    text-align: left;
    min-width: 119px;
    justify-content: flex-start;
  }
`

export const StyledExtraContent = styled.div`
  display: flex;
  flex-direction: column;
`

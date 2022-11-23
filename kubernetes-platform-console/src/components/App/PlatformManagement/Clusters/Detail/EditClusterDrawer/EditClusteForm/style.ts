import styled from 'styled-components'
import { Select, Checkbox } from 'infrad'

export const Container = styled.div`
  margin-bottom: 2em;
  .ant-typography {
    color: #151515;
    font-size: 16px;
    line-height: 3;
  }
  .ant-typography::before {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
  label {
    margin-bottom: 20px;
  }
`
export const StyledSelect = styled(Select)`
  width: 100%;
`

export const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0.5em;
`

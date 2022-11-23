import styled from 'styled-components'
import { Cascader } from 'infrad'

export const StyledCascader = styled(Cascader)`
  nz-cascader {
    input {
      padding-right: 24px;
      text-overflow: ellipsis;
    }
    .ant-cascader-picker-label {
      padding-right: 24px;
    }
  }
`

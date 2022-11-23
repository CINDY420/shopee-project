import styled from 'styled-components'
import { Form, Space } from 'infrad'
import { ifPropsDefined, ifPropsTruthy } from 'src/helpers/styleMixins'
import { Search } from 'src/components/App/Tenant/AppClusterConfig/Search/index'

export const StyledSearch = styled(Search)`
  background-color: #fff;
`

export const StyledForm: typeof Form = styled(Form)``

export const StyledSpace = styled(Space)`
  float: right;
`

export const StyledFormItem = styled(Form.Item)<{
  $width?: string
  $isMovedRight?: boolean
  $isFontBold?: boolean
}>`
  ${(props) => ifPropsDefined(props, '$width')`
    .ant-form-item-control {
      width: ${props.$width};
    }
  `}

  ${(props) => ifPropsTruthy(props, '$isMovedRight')`
    margin-left: auto;
  `}

  ${(props) => ifPropsTruthy(props, '$isFontBold')`
    .ant-btn {
      font-weight: 500;
    }
  `}
`

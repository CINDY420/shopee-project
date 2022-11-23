import styled from 'styled-components'
import { ifPropsDefined, ifPropsTruthy, resetCSS } from 'src/helpers/styleMixins'
import { ConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/index'
import { Form, Space } from 'infrad'

export const StyledConfigForm = styled(ConfigForm)`
  ${() => resetCSS()}
`

export const FlexSpace = styled(Space)`
  display: flex;
`

export const StyledFormBox = styled.div<{
  $isWide?: boolean
}>`
  display: inline-block;
  padding: 16px;
  min-width: 562px;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  margin-bottom: 20px;
  max-height: calc(100vh - 483px + 12px);
  overflow-y: scroll;

  header {
    width: 100%;
    margin-bottom: 16px;

    span {
      display: inline-block;
      width: 240px;
      margin-right: 8px;
    }
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-select-selector {
    height: 32px;
    overflow-y: scroll;
  }

  ${(props) => ifPropsTruthy(props, '$isWide')`
    display: block;
    
    .ant-space-item:nth-child(2){
      flex: 1;
    }
  `}
`

export const StyledFormItem = styled(Form.Item)<{
  $width?: string
  $isAddButton?: boolean
}>`
  ${(props) => ifPropsDefined(props, '$width')`
    .ant-form-item-control.ant-col[role="cell"] {
      width: ${props.$width};
    }
  `}

  ${(props) => ifPropsDefined(props, '$width')`
    .ant-form-item-control:first-child:not([class^='ant-col-']):not([class*=' ant-col-']) {
      width: ${props.$width};
    }
  `}

  ${(props) => ifPropsTruthy(props, '$isAddButton')`
    .ant-form-item-control.ant-col[role="cell"] {
      padding-right: 40px;
    }
  `}
`

export const DivWrapperForIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledFooter = styled.footer`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  button {
    width: 240px;
    height: 40px;
  }
`

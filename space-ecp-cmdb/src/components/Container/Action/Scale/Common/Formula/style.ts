import { InputNumber } from 'infrad'
import styled from 'styled-components'

export const FormulaContainer = styled.div`
  display: flex;
`

export const FormulaContent = styled.div`
  display: flex;
  align-items: center;

  .ant-input-number {
    width: 100%;
  }
`

export const FormulaInner = styled.div`
  display: flex;

  & > .ant-form-item {
    margin-top: 8px;
    margin-bottom: 0;
  }
`

export const Phase = styled.div`
  margin-bottom: 8px;
`

export const Sign = styled.div`
  align-self: end;
  margin: 0 14px;
  line-height: 32px;
`

interface IDiffFormItemProps {
  $changed?: boolean
}

export const DiffInputNumber = styled(InputNumber)`
  width: max-content;
  &.ant-input-number-disabled {
    color: ${(props: IDiffFormItemProps) => (props.$changed ? '#000000' : '#00000040')};
    background-color: ${(props: IDiffFormItemProps) => (props.$changed ? '#d9f7be' : '#f5f5f5')};
  }
`

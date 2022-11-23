import styled from 'styled-components'
import { Input } from 'infrad'

interface IStyledTable {
  bordered?: boolean
}

export const StyledTable = styled.table<IStyledTable>`
  border-collapse: collapse;
  width: 100%;

  td.key {
    background-color: #f6f6f6;
    color: #666666;
    width: 240px;
  }

  td.required-key {
    text-align: right;
    width: 240px;
  }

  td {
    border: ${props => (props.bordered !== false ? '1px solid #e5e5e5' : 'none')};
    padding: ${props => (props.bordered !== false ? '12px' : '0 12px')};
    line-height: 32px;
  }
`

interface IRequiredKey {
  marginTop?: string
}

export const RequiredKey = styled.div<IRequiredKey>`
  margin-top: ${props => props.marginTop || '-24px'};

  &::before {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`

export const InfoWrapper = styled.div`
  margin-top: 4px;
  background-color: #f6f6f6;
  padding: 9px;
  border-radius: 2px;
`

export const LimitInput = styled(Input)`
  width: 85px;

  .ant-input-group-addon {
    background-color: transparent;
    color: #999999;
  }
`

export const StyledError = styled.div`
  margin-top: -32px;
  color: #ff4742;
`

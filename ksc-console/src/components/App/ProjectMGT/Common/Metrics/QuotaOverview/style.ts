import styled from 'styled-components'
import { Card, Select, Radio } from 'infrad'

interface IFilterWrapper {
  alignItems: string
  padding: string
}

export const FilterWrapper = styled.div<IFilterWrapper>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  padding: ${(props) => props.padding};
  align-items: ${(props) => props.alignItems};
`

export const SelectWrapper = styled.div`
  min-width: 20em;
  display: flex;
  align-items: center;
  margin-left: 1em;

  > span {
    margin-right: 0.3em;
  }
`
export const StyledSelect = styled(Select)`
  flex: 1;
`

export const RadioTabs = styled(Radio.Group)`
  height: 31px;
`

export const StyledRadioButton = styled(Radio.Button)`
  height: 31px;
`

export const QuotasWrapper = styled.div`
  width: 100%;
  height: 172px;
  display: flex;
  flex-direction: row;
  .ant-card {
    width: calc((100% - 32px) / 3);
    margin-right: 16px;
  }
`
export const StyledCard = styled(Card)`
  width: 450px;
`

import { AutoDisabledSelect } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import styled from 'styled-components'

export const Hint = styled.div`
  color: rgba(0, 0, 0, 0.45);
  margin-left: 8px;
`

export const StyledAutoDisabledSelect = styled(AutoDisabledSelect)`
  .ant-select-selection-overflow-item:nth-last-child(2) {
    .ant-select-selection-item {
      background: #fff1f0;
      border: 1px solid #ffa39e;
    }
  }
`

export const CustomStyle = styled.div.attrs(
  (props: { $errorList: Record<number, number[]> }) => props,
)`
  ${(props) => {
    const errorList = props.$errorList
    let res = ''
    Object.entries(errorList).forEach(([index, list]) => {
      list.forEach((each) => {
        res += `
        tbody tr:nth-child(${index}) .ant-select-selection-overflow-item:nth-child(${each}) {
          .ant-select-selection-item {
            background: #fff1f0;
            border: 1px solid #ffa39e;
          }
        }
        
        `
      })
    })
    return res
  }}
`

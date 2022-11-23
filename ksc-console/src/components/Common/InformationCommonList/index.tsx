import React from 'react'
import { StyledBasic, StyledSingleInfo, StyledInfoName, StyledInfoValue } from './style'

interface INameMap {
  name: string
  key: string
  format?: (value: IFormatValue) => string | number | React.ReactNode
}

interface IBasicCommon {
  nameMaps: Array<INameMap>
  data: Record<string, string | React.ReactNode>
}
type IFormatValue = string | number | boolean | React.ReactNode
const formatInfoValue = (value?: IFormatValue, format?: INameMap['format']) => {
  if (value === undefined) return '--'
  if (format) {
    return format(value)
  }
  if (typeof value === 'boolean') return `${value}`
  return value
}
const InformationCommonList = (props: IBasicCommon) => {
  const { nameMaps, data } = props
  return (
    <StyledBasic>
      {nameMaps.map((item) => (
        <StyledSingleInfo key={item.name}>
          <StyledInfoName>{item.name}</StyledInfoName>
          <StyledInfoValue>{formatInfoValue(data[item.key], item.format)}</StyledInfoValue>
        </StyledSingleInfo>
      ))}
    </StyledBasic>
  )
}

export default InformationCommonList

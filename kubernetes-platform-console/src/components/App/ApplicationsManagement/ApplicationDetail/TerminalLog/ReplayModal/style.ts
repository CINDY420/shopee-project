import styled from 'styled-components'
import { Typography, Tag } from 'infrad'
const { Text } = Typography

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const InfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`
export const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
export const StyledText = styled(Text)`
  margin-bottom: 12.5px;
  margin-right: 8px;
`
export const StyledTag = styled(Tag)`
  display: block;
  margin-bottom: 12.5px;
`
export const AlertWrapper = styled.div`
  display: flex;
  background-color: #ebf2fb;
  margin-top: 20px;
  border: 1px solid #4eabf5;
  padding: 16px;
`

export const StyledIcon = styled.div`
  height: 14px;
  width: 14px;
`
export const Message = styled.span`
  margin-left: 9px;
  margin-right: 12px;
  color: #666666;
  font-family: 'Roboto';
  font-size: 14px;
  padding: 0;
  line-height: 18px;
`
export const PlayWrapper = styled.div`
  margin-top: 24px;
  height: 500px;
`
export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

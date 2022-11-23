import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'antd'

export const StyledCommonContent = styled.div`
  background-color: #fff;
  padding: 24px;
  // height: 100%;
  margin-bottom: 16px;
`

export const StyledSuffix = styled.span`
  font-size: 14px;
  color: #999;
`

export const StyledLinkName = styled(Link)`
  display: block;
  line-height: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #2673dd;
  text-decoration: underline;
  cursor: pointer;
`

export const StyledEllipsis = styled.div`
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const StyledTitle = styled.div`
  font-weight: bold;
  font-size: 26px;
  line-height: 28px;
  color: #333;
  margin-bottom: 24px;
`

export const StyleTag = styled.span`
  padding: 4px 8px;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  background: #fafafa;
  color: #333333;
  font-size: 14px;
  margin: 0 4px 4px 0;
  display: inline-block;
`

export const StyledLinkButton = styled(Button)`
  padding-left: 0;
`

export const StyledSubTitle = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  color: #333;
  margin-bottom: 32px;
`

export const StyledBlockTitle = styled.div`
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 24px;
`

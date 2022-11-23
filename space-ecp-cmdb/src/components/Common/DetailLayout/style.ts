import styled from 'styled-components'

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 24px 24px 16px 24px;
`

export const Header = styled.div`
  background-color: #ffffff;
  padding: 0 24px;
`

export const ResourceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 22px;
`

export const HeaderBody = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

export const TitleText = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-left: 24px;
  margin-right: 12px;
`

export const TagsWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  flex-wrap: wrap;
  line-height: 32px;
  padding: 6px 0;
  flex-grow: 1;
`

export const StyledTag = styled.div`
  display: inline-block;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 0px 6px;
  margin-left: 4px;
  line-height: 20px;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`

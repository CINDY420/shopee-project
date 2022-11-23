import styled from 'styled-components'

export const EnabledAlertWrapper: any = styled.div`
  height: 74px;
  background-color: ${(props: any) => (props.theme === true ? '#F2FBF4' : '#FFF1F0')};
  border: ${(props: any) => (props.theme === true ? '1px solid #7ED898' : '1px solid #FF736F;')};
  padding: 16px 0px 0px 0px;
  margin-right: 170px;
`
export const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  margin-left: 17px;
  margin-bottom: 4px;
  align-items: center;
`
export const Icon = styled.div`
  display: flex;
  height: 14px;
  width: 14px;
  align-items: center;
`
export const Message = styled.div`
  margin-left: 9px;
  margin-right: 12px;
  height: 20px;
  color: #333333;
  font-family: 'Roboto';
  font-size: 16px;
  line-height: 20px;
  line-height: 20px;
  padding: 0px 0px 0px 0px;
`
export const Description = styled.div`
  margin-left: 40px;
  margin-right: 12px;
  height: 18px;
  color: #666666;
  font-family: 'Roboto';
  font-size: 14px;
  line-height: 18px;
`

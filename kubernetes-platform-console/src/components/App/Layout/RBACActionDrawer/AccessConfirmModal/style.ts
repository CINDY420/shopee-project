import styled from 'styled-components'
import { Checkbox, Modal } from 'infrad'

export const StyledTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 16px;
`

export const StyleContainer = styled.div`
  display: flex;
  height: auto;
  align-items: stretch;
`

export const StyledBox = styled.div`
  background: #fafafa;
  padding: 16px;
  width: 50%;
`

export const StyledBoxTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`

export const StyledGroup = styled.div`
  font-size: 12px;
  margin-top: 8px;
`

export const StyledDeleteGroup = styled(StyledGroup)`
  color: #b7b7b7;
  text-decoration: line-through;
`

export const StyledArrow = styled.div`
  margin: 0 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
`

export const StyledCheckbox = styled(Checkbox)`
  display: ${(props: { display: boolean }) => (props.display ? 'flex' : 'none')};
  float: left;

  .ant-checkbox + span {
    width: 220px;
    text-align: left;
  }
`

export const StyledModal = styled(Modal)`
  .ant-modal-footer {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`

import styled from 'styled-components'

export const CustomInputWrapper = styled.div`
  position: relative;
`

export const OptionWrapper = styled.div`
  position: absolute;
  top: 28px;
  width: 140px;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.199683);
  padding: 8px 0;
  z-index: 999;
`

export const OptionItem = styled.div`
  color: #4a4a4a;
  cursor: pointer;
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;

  &:hover {
    background: #e6f7ff;
  }
`

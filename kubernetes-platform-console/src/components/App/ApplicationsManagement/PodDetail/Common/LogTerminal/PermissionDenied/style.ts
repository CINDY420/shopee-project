import styled from 'styled-components'
import { Result, Input } from 'infrad'
import InformationSvg from 'assets/information.svg'
import InformationGreySvg from 'assets/information-grey.svg'

const { TextArea } = Input

interface IProps {
  reasonOverLength: boolean
}

export const Desc = styled.div`
  font-size: 16px;
  text-align: center;
  color: #2673dd;
`

export const Informer = styled.div`
  text-align: center;
`

export const StyleResult = styled(Result)`
  padding-bottom: 1em;

  .ant-result-extra {
    margin-top: 1em;
  }
`
export const SubTitle = styled.div`
  color: #333;

  span {
    font-weight: 600;
  }
`

export const Title = styled.div`
  margin-bottom: 24px;
`

const InformationIconWrapper = styled.div`
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`

export const TitleInformationIcon = styled(InformationIconWrapper)`
  background-image: url(${InformationSvg});
  width: 42px;
  height: 42px;
  margin: auto;
`

export const TextAreaWrapper = styled.div`
  width: 500px;
  margin: auto;
  margin-top: 24px;
  margin-bottom: 48px;
`

export const StyledTextArea = styled(TextArea)<IProps>`
  resize: none;
  width: 500px;
  height: 120px !important;
  ${props => (props.reasonOverLength ? 'border-color: #FF4742;' : '')} :hover,
  :focus {
    ${props => (props.reasonOverLength ? 'border-color: #FF4742;' : '')}
  }

  :focus {
    ${props => (props.reasonOverLength ? 'box-shadow: 0 0 0 2px rgba(255, 71, 66, 0.2);' : '')}
  }
`

export const PromptBar = styled.div`
  color: #b7b7b7;
  cursor: default;
  display: flex;
  justify-content: space-between;

  span {
    font-weight: 400;
  }
`

export const ApproverListIcon = styled(InformationIconWrapper)`
  background-image: url(${InformationGreySvg});
  width: 15px;
  height: 15px;
  display: inline-block;
  color: #b7b7b7;
  position: relative;
  top: 2px;
  margin-left: 2px;
`

export const TextNumCount = styled.span<IProps>`
  ${props => (props.reasonOverLength ? 'color: #FF4742' : '')}
`

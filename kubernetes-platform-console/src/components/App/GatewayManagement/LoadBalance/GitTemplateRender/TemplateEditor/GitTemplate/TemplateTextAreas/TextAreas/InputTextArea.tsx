import * as React from 'react'
import { RedoOutlined } from 'infra-design-icons'

import useAsyncFn from 'hooks/useAsyncFn'
import { loadBalanceControllerGetTemplate } from 'swagger-api/v3/apis/LoadBalances'

import { TEMPLATE_TYPE } from '../index'

import BaseTextArea from './Common/BaseTextArea'

import { StyledButton, StyledTooltip } from './style'

interface IProps {
  isFirstEdit: boolean
  defaultValue: string
  templateType: TEMPLATE_TYPE
  onTemplateChange: (templateType: TEMPLATE_TYPE, value: string) => void
}

const InputTextArea: React.FC<IProps> = ({ defaultValue, templateType, onTemplateChange, isFirstEdit }) => {
  const [template, setTemplate] = React.useState(defaultValue)
  const [getTemplateState, getTemplateFn] = useAsyncFn(loadBalanceControllerGetTemplate)

  const handleButtonClick = React.useCallback(() => {
    getTemplateFn().then(value => {
      setTemplate(value[templateType])
    })
  }, [getTemplateFn, templateType])

  const handleTemplateChange = React.useCallback(value => setTemplate(value), [])

  React.useEffect(() => {
    if (isFirstEdit) {
      getTemplateFn().then(value => {
        setTemplate(value[templateType])
      })
    }
  }, [getTemplateFn, isFirstEdit, templateType])

  React.useEffect(() => {
    if (!defaultValue) {
      setTemplate('')
    }
  }, [defaultValue])

  React.useEffect(() => {
    onTemplateChange(templateType, template)
  }, [onTemplateChange, template, templateType])

  const title = `${templateType === TEMPLATE_TYPE.FRONTEND ? 'Frontend' : 'Backend'} Template`
  const isLoading = getTemplateState.loading

  return (
    <BaseTextArea
      title={title}
      value={template}
      loading={isLoading}
      onChange={handleTemplateChange}
      button={
        <StyledButton icon={<RedoOutlined />} onClick={handleButtonClick}>
          <StyledTooltip title='Reset template to default value.' color='white'>
            <span>Reset</span>
          </StyledTooltip>
        </StyledButton>
      }
    />
  )
}

export default InputTextArea

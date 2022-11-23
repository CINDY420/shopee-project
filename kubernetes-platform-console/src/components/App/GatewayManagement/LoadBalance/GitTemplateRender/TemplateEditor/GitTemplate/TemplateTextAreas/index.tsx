import * as React from 'react'
import { Row, Col, Button } from 'infrad'
import { QuestionCircleOutlined } from 'infra-design-icons'

import { ENVS } from '../../index'
import useAsyncFn from 'hooks/useAsyncFn'
import { IGetInfoResponseDto, IGetTemplateResponseDto } from 'swagger-api/v3/models'
import { loadBalanceControllerRenderTemplate } from 'swagger-api/v3/apis/LoadBalances'

import InputTextArea from './TextAreas/InputTextArea'
import OutputTextArea from './TextAreas/OutputTextArea'
import WildcardTable from './WildcardTable'

import { Wrapper, StyledDivider, Info, Modal } from './style'

interface IProps {
  selectedEnv: ENVS
  cidsEnvsClusters: IGetInfoResponseDto
}

export enum TYPE {
  INPUT,
  OUTPUT
}

export enum TEMPLATE_TYPE {
  FRONTEND = 'frontend',
  BACKEND = 'backend'
}

const TemplateTextAreas: React.FC<IProps> = ({ selectedEnv, cidsEnvsClusters }) => {
  const localStorageKey = `Load Balance ${selectedEnv} Templates`
  const defaultTemplates = JSON.parse(window.localStorage.getItem(localStorageKey))
  const isFirstEdit = defaultTemplates === null

  const [isVisible, setIsVisible] = React.useState(false)
  const [templates, setTemplates] = React.useState<IGetTemplateResponseDto>(defaultTemplates || {})
  const [renders, setRenders] = React.useState({})

  const [templateRenderState, templateRenderFn] = useAsyncFn(loadBalanceControllerRenderTemplate)

  const handleOpen = React.useCallback(() => setIsVisible(true), [])
  const handleClose = React.useCallback(() => setIsVisible(false), [])

  const handleTemplateChange = React.useCallback((templateType: TEMPLATE_TYPE, value: string) => {
    setTemplates(previousState => {
      return {
        ...previousState,
        [templateType]: value
      }
    })
  }, [])

  const handleRenderClick = React.useCallback(() => {
    templateRenderFn({
      payload: {
        ...cidsEnvsClusters,
        ...templates
      }
    })
  }, [cidsEnvsClusters, templateRenderFn, templates])

  const handleClearClick = React.useCallback(() => {
    setTemplates({})
    setRenders({})
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(templates))
  }, [localStorageKey, templates])

  React.useEffect(() => {
    if (templateRenderState.value) {
      setRenders(templateRenderState.value)
    }
  }, [templateRenderState.value])

  const isOutputLoading = templateRenderState.loading
  const info = 'Use variables {{env}}, {{cid}}, {{domain_env_flag}}, {{domain_cid_suffix}}, {{kube_cluster}}. '

  return (
    <>
      <Row gutter={24} style={{ marginTop: '12px' }}>
        <Col span={12}>
          <Wrapper>
            <InputTextArea
              isFirstEdit={isFirstEdit}
              defaultValue={templates.frontend}
              templateType={TEMPLATE_TYPE.FRONTEND}
              onTemplateChange={handleTemplateChange}
            />
            <StyledDivider />
            <InputTextArea
              isFirstEdit={isFirstEdit}
              defaultValue={templates.backend}
              templateType={TEMPLATE_TYPE.BACKEND}
              onTemplateChange={handleTemplateChange}
            />
          </Wrapper>
          <Info>
            {info}
            <QuestionCircleOutlined style={{ cursor: 'pointer' }} onClick={handleOpen} />
          </Info>
          <Row gutter={24} justify='end' style={{ marginTop: '24px' }}>
            <Col>
              <Button onClick={handleClearClick}>Clear all</Button>
            </Col>
            <Col>
              <Button type='primary' onClick={handleRenderClick}>
                Render
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Wrapper style={{ background: '#F6F6F6' }}>
            <OutputTextArea
              loading={isOutputLoading}
              templateType={TEMPLATE_TYPE.FRONTEND}
              value={renders[TEMPLATE_TYPE.FRONTEND] || ''}
            />
            <StyledDivider />
            <OutputTextArea
              loading={isOutputLoading}
              templateType={TEMPLATE_TYPE.BACKEND}
              value={renders[TEMPLATE_TYPE.BACKEND] || ''}
            />
          </Wrapper>
        </Col>
      </Row>
      <Modal
        centered
        width='auto'
        visible={isVisible}
        title='Available Wildcard Character'
        getContainer={() => document.body}
        onCancel={handleClose}
        footer={
          <Row justify='end'>
            <Col>
              <Button type='primary' onClick={handleClose}>
                OK
              </Button>
            </Col>
          </Row>
        }
      >
        <WildcardTable />
      </Modal>
    </>
  )
}

export default TemplateTextAreas

import * as React from 'react'
import { Spin, Empty, Row, Col, Tabs, Button, Modal, Form, Input, message } from 'infrad'
import { IApplicationGetResponseDto } from 'swagger-api/v3/models'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { CenterWrapper } from 'common-styles/flexWrapper'
import { RadiosTabs, RadiosTabPane } from 'components/Common/RadiosTabs'
import { VerticalDivider } from 'common-styles/divider'
import {
  deployConfigControllerGetDeployConfig,
  deployConfigControllerListDeployConfigEnvs,
  deployConfigControllerUpdateDeployConfig
} from 'swagger-api/v1/apis/DeployConfig'
import {
  IGetDeployConfigResponse,
  IListDeployConfigEnvsResponse,
  IListEnableHybridDeployTenantsResponse
} from 'swagger-api/v1/models'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'

import {
  Root,
  StyledTabs,
  ContentWrap,
  StyledRow,
  CommentFormItem,
  StyledModal,
  CenterTextWrapper,
  StyledButton
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/style'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import ListView from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView'
import TextArea from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/TextArea'
import {
  DeployConfigContext,
  getDispatchers,
  initialState,
  reducer
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import FormAnchor from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Anchor'
import PromptCreator from 'components/Common/PromptCreator'
import useAsyncFn from 'hooks/useAsyncFn'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'
import { tenantControllerListEnableHybridDeployTenants } from 'swagger-api/v1/apis/Tenant'

const CONFIRM_MESSAGE = "The changes you made to the deploy config haven't been saved"
const { Prompt } = PromptCreator({
  content: CONFIRM_MESSAGE
})

const { TabPane } = Tabs

export enum VIEW_MODES {
  LIST_VIEW = 'List View',
  TEXT_AREA = 'Text Area'
}

export enum CONFIG_TABS {
  LATEST = 'Latest',
  RELEASED = 'Released',
  HISTORY = 'History'
}

export enum VALIDATE_TRIGGERS {
  VIEW_MODE_CHANGE,
  CODE_DIFF_VIEW,
  SAVE
}

export enum VALIDATE_TYPES {
  FORM,
  JSON
}

export enum VALIDATE_STATUS {
  START,
  SUCCESS
}

export interface IUpdateNewDeployConfig {
  validateType: VALIDATE_TYPES
  validateTrigger: VALIDATE_TRIGGERS
  validateStatus: VALIDATE_STATUS
}

const VIEW_MODES_MAP = {
  [VIEW_MODES.TEXT_AREA]: VALIDATE_TYPES.FORM,
  [VIEW_MODES.LIST_VIEW]: VALIDATE_TYPES.JSON
}

const VALIDATE_TYPE_MAP = {
  [VALIDATE_TYPES.FORM]: VIEW_MODES.TEXT_AREA,
  [VALIDATE_TYPES.JSON]: VIEW_MODES.LIST_VIEW
}

export const DISABLED_CONFIG_TABS = [CONFIG_TABS.RELEASED, CONFIG_TABS.HISTORY]

const FETCH_CONFIG_FN_MAP = {
  [CONFIG_TABS.LATEST]: deployConfigControllerGetDeployConfig
  // [TABS.RELEASED]: groupAPIGetApplicationConfigRelease,
  // [TABS.HISTORY]: groupAPIGetApplicationConfigHistory
}

interface IDeployConfigProps {
  application: IApplicationGetResponseDto
}

const DeployConfig: React.FC<IDeployConfigProps> = ({ application }) => {
  const [updateNewDeployConfigState, setUpdateNewDeployConfigState] = React.useState<
    IUpdateNewDeployConfig | undefined
  >(undefined)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { tenantId, projectName, name: appName } = application

  const contentWrapRef = React.useRef<HTMLDivElement>(null)
  const [version, setVersion] = React.useState('')
  const [enable, setEnable] = React.useState(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const applicationActions = accessControlContext[RESOURCE_TYPE.APPLICATION_DEPLOY_CONFIG]
  const canEditConfig = applicationActions.includes(RESOURCE_ACTION.Edit)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])
  const { isEditing, newDeployConfig, deployConfig } = state

  const getDeployConfigEnvsFnWithResources = React.useCallback(async () => {
    return deployConfigControllerListDeployConfigEnvs({
      tenantId: tenantId.toString(),
      appName,
      projectName
    })
  }, [appName, projectName, tenantId])

  const [getDeployConfigEnvsState, getDeployConfigEnvsFn] = useAsyncIntervalFn<IListDeployConfigEnvsResponse>(
    getDeployConfigEnvsFnWithResources
  )
  const { value } = getDeployConfigEnvsState
  const { envs = [] } = value || {}

  React.useEffect(() => {
    getDeployConfigEnvsFn()
  }, [getDeployConfigEnvsFn])

  const [queryParams, setQueryParams] = useQueryParams({
    selectedEnv: withDefault(StringParam, envs[0]),
    selectedConfigTab: withDefault(StringParam, CONFIG_TABS.LATEST),
    selectedViewMode: withDefault(StringParam, VIEW_MODES.LIST_VIEW)
  })
  const { selectedEnv, selectedConfigTab, selectedViewMode } = queryParams
  const defaultSelectedEnv = envs[0]

  React.useEffect(() => {
    setQueryParams({
      selectedEnv: selectedEnv || defaultSelectedEnv
    })
  }, [defaultSelectedEnv, selectedEnv, setQueryParams])

  const getDeployConfigDataFnWithResources = React.useCallback(async () => {
    if (!selectedEnv) return

    const fetchFn = FETCH_CONFIG_FN_MAP[selectedConfigTab]

    return fetchFn({
      tenantId,
      projectName,
      appName,
      env: selectedEnv
    })
  }, [appName, projectName, selectedConfigTab, selectedEnv, tenantId])

  const [getDeployConfigDataState, getDeployConfigDataFn] = useAsyncIntervalFn<IGetDeployConfigResponse>(
    getDeployConfigDataFnWithResources,
    {
      enableIntervalCallback: !isEditing
    }
  )

  const [getHybridDeployTenantsState, getHybridDeployTenantsFn] = useAsyncFn<IListEnableHybridDeployTenantsResponse>(
    tenantControllerListEnableHybridDeployTenants
  )

  const confirm = React.useCallback(
    (handleConfirm: () => void) =>
      Modal.confirm({
        content: CONFIRM_MESSAGE,
        okText: 'Leave',
        cancelText: 'Cancel',
        onOk() {
          handleConfirm()
        }
      }),
    []
  )

  const handleEnvChange = (newEnv: string) => {
    if (isEditing) {
      confirm(() => {
        dispatchers.cancelEdit()
        setQueryParams({
          selectedEnv: newEnv
        })
      })
      return
    }

    setQueryParams({
      selectedEnv: newEnv
    })
  }

  const handleConfigTabChange = (newConfigTab: CONFIG_TABS) =>
    setQueryParams({
      selectedConfigTab: newConfigTab
    })

  const handleCancelEdit = () =>
    confirm(() => {
      getDeployConfigDataFn()
      dispatchers.cancelEdit()
    })

  const [saveForm] = Form.useForm()
  const [, updateDeployConfigFn] = useAsyncFn(deployConfigControllerUpdateDeployConfig)

  const submitDeployConfig = React.useCallback(async () => {
    const values = await saveForm.validateFields()
    updateDeployConfigFn({
      tenantId: tenantId.toString(),
      appName,
      projectName,
      payload: {
        env: selectedEnv,
        comment: values.comment,
        deployConfig: JSON.stringify(newDeployConfig),
        version
      }
    }).then(() => {
      message.success('Update deploy config success.')
      saveForm.resetFields()
      getDeployConfigDataFn()
      dispatchers.cancelEdit()
    })
  }, [
    appName,
    dispatchers,
    getDeployConfigDataFn,
    newDeployConfig,
    projectName,
    saveForm,
    selectedEnv,
    tenantId,
    updateDeployConfigFn,
    version
  ])

  const handleSave = React.useCallback(async () => {
    const content = (
      <Form form={saveForm}>
        <Form.Item>
          The config will take effect during the next deployment. Please type the commit message then save the change.
        </Form.Item>
        <CommentFormItem label='Commit Message' name='comment' rules={[{ required: true }]}>
          <Input placeholder='Please Input commit message' />
        </CommentFormItem>
      </Form>
    )
    Modal.confirm({
      title: 'Notice',
      icon: null,
      content,
      okText: 'Confirm',
      width: 600,
      onOk() {
        return submitDeployConfig()
      }
    })
  }, [saveForm, submitDeployConfig])

  const handleTriggerUpdateDeployConfig = (trigger: VALIDATE_TRIGGERS) => {
    isEditing &&
      setUpdateNewDeployConfigState({
        validateStatus: VALIDATE_STATUS.START,
        validateType: selectedViewMode === VIEW_MODES.TEXT_AREA ? VALIDATE_TYPES.JSON : VALIDATE_TYPES.FORM,
        validateTrigger: trigger
      })
  }

  const handleViewModeChange = async (mode: VIEW_MODES) => {
    isEditing
      ? setUpdateNewDeployConfigState({
          validateType: VIEW_MODES_MAP[mode],
          validateStatus: VALIDATE_STATUS.START,
          validateTrigger: VALIDATE_TRIGGERS.VIEW_MODE_CHANGE
        })
      : setQueryParams({ selectedViewMode: mode })
  }

  const handleValidateFinish = React.useCallback(
    (state: IUpdateNewDeployConfig) => setUpdateNewDeployConfigState(state),
    []
  )

  React.useEffect(() => {
    const { value } = getDeployConfigDataState
    if (value) {
      const { deployConfig, version, enable } = value
      setVersion(version)
      setEnable(enable)
      dispatchers.updateDeployConfig(deployConfig)
    }
  }, [dispatchers, getDeployConfigDataState])

  React.useEffect(() => {
    const { value } = getHybridDeployTenantsState
    if (value) {
      const { tenants } = value
      dispatchers.updateHybridDeployTenants(tenants)
    }
  }, [dispatchers, getHybridDeployTenantsState])

  React.useEffect(() => {
    getDeployConfigDataFn()
  }, [getDeployConfigDataFn])

  React.useEffect(() => {
    getHybridDeployTenantsFn()
  }, [getHybridDeployTenantsFn])

  React.useEffect(() => {
    if (updateNewDeployConfigState && updateNewDeployConfigState.validateStatus === VALIDATE_STATUS.SUCCESS) {
      const { validateTrigger, validateType } = updateNewDeployConfigState
      switch (validateTrigger) {
        case VALIDATE_TRIGGERS.VIEW_MODE_CHANGE:
          const mode = VALIDATE_TYPE_MAP[validateType]
          setQueryParams({
            selectedViewMode: mode
          })
          setUpdateNewDeployConfigState(undefined)
          break
        case VALIDATE_TRIGGERS.CODE_DIFF_VIEW:
          setIsModalVisible(true)
          setUpdateNewDeployConfigState(undefined)
          break
        case VALIDATE_TRIGGERS.SAVE:
          handleSave().then(() => {
            setUpdateNewDeployConfigState(undefined)
          })
          break
        default:
          break
      }
    }
  }, [handleSave, setQueryParams, updateNewDeployConfigState])

  const configTabs = Object.values(CONFIG_TABS)
  const viewModes = Object.values(VIEW_MODES)

  const isSpinning =
    getDeployConfigDataState.loading ||
    getHybridDeployTenantsState.loading ||
    updateNewDeployConfigState?.validateStatus === VALIDATE_STATUS.START

  return (
    <Root ref={contentWrapRef}>
      {envs.length ? (
        <Prompt when={!!isEditing}>
          <DeployConfigContext.Provider value={{ state, dispatch }}>
            <Row align='middle'>
              <Col style={{ marginRight: '6px' }}>ENV</Col>
              <Col style={{ marginRight: '24px' }}>
                <RadiosTabs activeKey={selectedEnv} onChange={handleEnvChange}>
                  {envs.map(env => (
                    <RadiosTabPane key={env} name={env} value={env}></RadiosTabPane>
                  ))}
                </RadiosTabs>
              </Col>
            </Row>
            <VerticalDivider size='24px' />
            <StyledTabs activeKey={selectedConfigTab} tabPosition='top' type='card' onChange={handleConfigTabChange}>
              {configTabs.map(configTab => {
                return (
                  <TabPane
                    key={configTab}
                    tab={configTab}
                    disabled={DISABLED_CONFIG_TABS.includes(configTab)}
                    style={{ overflow: 'hidden' }}
                  >
                    <Row align='middle' justify='space-between'>
                      <Col>
                        <div style={{ margin: '16px 0' }}>
                          <RadiosTabs activeKey={selectedViewMode} onChange={handleViewModeChange}>
                            {viewModes.map(mode => (
                              <RadiosTabPane key={mode} name={mode} value={mode}></RadiosTabPane>
                            ))}
                          </RadiosTabs>
                        </div>
                      </Col>
                      <Col>
                        <Button
                          type='primary'
                          disabled={isEditing || !canEditConfig}
                          onClick={() => dispatchers.enableEdit()}
                        >
                          Edit
                        </Button>
                      </Col>
                    </Row>
                    <ContentWrap>
                      <Spin spinning={isSpinning}>
                        {selectedViewMode === VIEW_MODES.LIST_VIEW ? (
                          <>
                            <FormAnchor containerNode={contentWrapRef.current} />
                            <ListView
                              enable={enable}
                              updateNewDeployConfigState={updateNewDeployConfigState}
                              onValidateFinish={handleValidateFinish}
                            />
                          </>
                        ) : (
                          <TextArea
                            updateNewDeployConfigState={updateNewDeployConfigState}
                            onValidateFinish={handleValidateFinish}
                          />
                        )}
                      </Spin>
                    </ContentWrap>
                  </TabPane>
                )
              })}
            </StyledTabs>
            <StyledRow
              style={{
                visibility: isEditing ? 'visible' : 'hidden',
                height: isEditing ? '56px' : '0'
              }}
              justify='center'
              align='middle'
              gutter={16}
            >
              <Col>
                <Button onClick={() => handleTriggerUpdateDeployConfig(VALIDATE_TRIGGERS.CODE_DIFF_VIEW)}>
                  Code Preview
                </Button>
              </Col>
              <Col>
                <Button onClick={() => handleCancelEdit()}>Cancel</Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => handleTriggerUpdateDeployConfig(VALIDATE_TRIGGERS.SAVE)}
                  disabled={!canEditConfig}
                >
                  Save
                </Button>
              </Col>
            </StyledRow>
          </DeployConfigContext.Provider>
        </Prompt>
      ) : (
        <CenterWrapper>
          <Spin spinning={getDeployConfigEnvsState.loading}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Spin>
        </CenterWrapper>
      )}
      <StyledModal
        title='Preview'
        width='80%'
        visible={isModalVisible}
        bodyStyle={{ overflowY: 'scroll' }}
        getContainer={() => document.body}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <CenterTextWrapper key='footer'>
            <StyledButton type='primary' onClick={() => setIsModalVisible(false)}>
              OK
            </StyledButton>
          </CenterTextWrapper>
        ]}
      >
        <ReactDiffViewer
          oldValue={JSON.stringify(deployConfig, null, 2)}
          newValue={JSON.stringify(newDeployConfig, null, 2)}
          splitView={true}
          compareMethod={DiffMethod.WORDS_WITH_SPACE}
          showDiffOnly={false}
        />
      </StyledModal>
    </Root>
  )
}

export default DeployConfig

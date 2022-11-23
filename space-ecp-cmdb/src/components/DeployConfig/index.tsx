import * as React from 'react'
import {
  Spin,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  message,
  List,
  Skeleton,
  Avatar,
  Alert,
} from 'infrad'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'
import { Validator } from 'jsonschema'
import {
  Root,
  ContentWrap,
  StyledRow,
  CommentFormItem,
  StyledModal,
  CenterTextWrapper,
  StyledButton,
  VersionList,
  CommitTitle,
  Title,
} from 'src/components/DeployConfig/style'
import ListView from 'src/components/DeployConfig/ListView'
import TextArea, { ECP_DEPLOY_CONFIG_SCHEMA } from 'src/components/DeployConfig/TextArea'
import {
  DeployConfigContext,
  getDispatchers,
  ICid,
  ICommits,
  ICurrentCommit,
  initialState,
  reducer,
  StrategyEngine,
  StrategyType,
  getConvertedFormValues,
} from 'src/components/DeployConfig/useDeployConfigContext'
import FormAnchor from 'src/components/DeployConfig/ListView/FormAnchor'
import PromptCreator from 'src/components/Common/PromptCreator'
import { fetch } from 'src/rapper'
import moment from 'moment'
import { IModels } from 'src/rapper/request'
import RouteSetRegion from 'src/components/Common/RouteSetRegion'

const CONFIRM_MESSAGE = "The changes you made to the deploy config haven't been saved"
const { Prompt } = PromptCreator({
  content: CONFIRM_MESSAGE,
})

enum Mode {
  FORM,
  TEXT,
}

interface IDeployConfigProps {
  tenantId: number
  serviceId: number
  cids: ICid[]
  env: string
  mode: Mode
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export enum ValidateTriggers {
  VIEW_MODE_CHANGE,
  CODE_DIFF_VIEW,
  SAVE,
}

export enum ValidateTypes {
  FORM,
  JSON,
}

export enum ValidateStatus {
  START,
  SUCCESS,
}

export interface IUpdateNewDeployConfig {
  validateType: ValidateTypes
  validateTrigger: ValidateTriggers
  validateStatus: ValidateStatus
}

type CreateCommitPayload = IModels['POST/api/ecp-cmdb/deploy-config/commit/create']['Req']
const DeployConfig: React.FC<IDeployConfigProps> = (props) => {
  const { serviceId, tenantId, env, cids, mode, isEditing, setIsEditing } = props
  const [updateNewDeployConfigState, setUpdateNewDeployConfigState] = React.useState<
    IUpdateNewDeployConfig | undefined
  >(undefined)
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const [listCommitsLoading, setListCommitsLoading] = React.useState(true)
  const [listHybridTenantsLoading, setListHybridTenantsLoading] = React.useState(true)
  const [commits, setCommits] = React.useState<ICommits>([])
  const [totalCommits, setTotalCommits] = React.useState(0)
  const containerWrapRef = React.useRef<HTMLDivElement>(null)
  const contentWrapRef = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState(1)

  const canEditConfig = true
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])
  React.useEffect(() => {
    isEditing ? dispatchers.enableEdit() : dispatchers.cancelEdit()
  }, [isEditing, dispatchers])
  const {
    newDeployConfig,
    deployConfig,
    currentCommit,
    deployConfigForms,
    componentType,
    errors,
    textarea,
  } = state

  const [mySelectedMode, setMySelectedMode] = React.useState<Mode>(Mode.FORM)

  const convertDeployFormValues = React.useCallback(async () => {
    const newDeployConfig = await getConvertedFormValues(deployConfigForms, deployConfig)
    dispatchers.updateNewDeployConfig(newDeployConfig)
  }, [deployConfig, deployConfigForms, dispatchers])

  const handleValidate = React.useCallback(
    () =>
      new Promise((resolve, reject) => {
        const validator = new Validator()
        const deployConfig = JSON.parse(textarea)
        const { valid, errors } = validator.validate(deployConfig, ECP_DEPLOY_CONFIG_SCHEMA)
        if (!valid) {
          const firstError = errors[0]
          message.error(`${firstError.property} ${firstError.message}`)
          reject()
        } else {
          dispatchers.updateNewDeployConfig(deployConfig)
          resolve(textarea)
        }
      }),
    [dispatchers, textarea],
  )
  React.useEffect(() => {
    // Do not validate when is not Edit Mode (faster)
    if (!isEditing) {
      setMySelectedMode(mode)
      return
    }

    if (mode === Mode.FORM) {
      handleValidate()
        .then(() => {
          setMySelectedMode(Mode.FORM)
        })
        .catch((e) => {
          void message.error('Error: JSON Format Error')
          console.error(e)
        })
    }
    if (mode === Mode.TEXT) {
      const hasError = Object.values(errors).includes(true)
      if (hasError) {
        void message.error('Form data validation failed, please resolve it before')
      } else {
        convertDeployFormValues()
          .then(() => {
            setMySelectedMode(Mode.TEXT)
          })
          .catch((e) => {
            console.error(e)
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  React.useEffect(() => {
    Object.values(deployConfigForms).forEach((form) => {
      form?.resetFields()
    })
    setIsEditing(false)
    dispatchers.cancelEdit()
    dispatchers.updateEnv(env)
    dispatchers.updateCids(cids)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cids, dispatchers, env, setIsEditing])

  React.useEffect(() => {
    if (deployConfig?.strategy_override?.find((override) => override.cid === 'default')) {
      dispatchers.updateStrategyEngine(StrategyEngine.BROMO_AND_KUBERNETES)
    } else if (
      deployConfig?.strategy?.name === StrategyType.RECREATE ||
      deployConfig?.strategy?.name === StrategyType.ROLLING_UPDATE
    ) {
      dispatchers.updateStrategyEngine(StrategyEngine.KUBERNETES)
    } else {
      dispatchers.updateStrategyEngine(StrategyEngine.BROMO)
    }
  }, [
    cids,
    deployConfig?.strategy?.name,
    deployConfig?.strategy_override,
    dispatchers,
    env,
    setIsEditing,
  ])

  const listCommitsFn = React.useCallback(async () => {
    if (env) {
      setListCommitsLoading(true)
      const { commits, total } = await fetch['GET/api/ecp-cmdb/deploy-config/commits']({
        env,
        serviceId,
        page,
        limit: 30,
      })
      setCommits(commits)
      setTotalCommits(total)
      const { items } = await fetch['GET/api/ecp-cmdb/workloads']({ env })
      dispatchers.updateWorkloads(items)
      if (commits?.length) {
        dispatchers.updateCurrentCommit(commits[0])
        const deployConfig = commits[0].data
        dispatchers.updateDeployConfig(deployConfig)
      } else {
        dispatchers.updateCurrentCommit(undefined)
        dispatchers.updateDeployConfig(initialState.deployConfig)
      }
    }
    setListCommitsLoading(false)
    // Do not monitor old deployConfig
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchers, env, serviceId])

  React.useEffect(() => {
    void listCommitsFn()
  }, [listCommitsFn])

  React.useEffect(() => {
    setPage(1)
    void listCommitsFn()
  }, [env, listCommitsFn])

  const getHybridDeployTenantsFn = React.useCallback(async () => {
    if (env) {
      setListHybridTenantsLoading(true)
      const { tenants } = await fetch['GET/api/ecp-cmdb/tenants:enableHybridDeployTenants']({})
      if (tenants) {
        dispatchers.updateHybridDeployTenants(tenants)
      }
      setListHybridTenantsLoading(false)
    }
  }, [dispatchers, env])

  React.useEffect(() => {
    void getHybridDeployTenantsFn()
  }, [getHybridDeployTenantsFn])

  const confirm = React.useCallback(
    (handleConfirm: () => void) =>
      Modal.confirm({
        content: CONFIRM_MESSAGE,
        okText: 'Leave',
        cancelText: 'Cancel',
        onOk() {
          handleConfirm()
        },
      }),
    [],
  )

  const handleCancelEdit = () =>
    confirm(() => {
      Object.values(deployConfigForms).forEach((form) => {
        form?.resetFields()
      })
      void listCommitsFn()
      setIsEditing(false)
      dispatchers.cancelEdit()
    })

  const [saveForm] = Form.useForm()

  const submitDeployConfig = React.useCallback(async () => {
    const values = await saveForm.validateFields()

    const payload: CreateCommitPayload = {
      comment: values.comment,
      data: JSON.stringify(newDeployConfig),
      env,
      service_id: serviceId,
    }
    await fetch['POST/api/ecp-cmdb/deploy-config/commit/create']({ ...payload })

    void message.success('Update deploy config success.')
    saveForm.resetFields()
    setIsEditing(false)
    setPage(1)
    void listCommitsFn()
    dispatchers.cancelEdit()
  }, [dispatchers, env, listCommitsFn, newDeployConfig, saveForm, serviceId, setIsEditing])

  const handleSave = React.useCallback(() => {
    if (componentType?.bromo.length !== 0 && componentType?.nonBromo.length !== 0) {
      dispatchers.updateStrategyEngine(StrategyEngine.BROMO_AND_KUBERNETES)
    } else if (componentType?.bromo.length !== 0) {
      dispatchers.updateStrategyEngine(StrategyEngine.BROMO)
    } else if (componentType?.nonBromo.length !== 0) {
      dispatchers.updateStrategyEngine(StrategyEngine.KUBERNETES)
    }
    const content = (
      <Form form={saveForm}>
        <Form.Item>
          The config will take effect during the next deployment. Please type the commit message
          then save the change.
        </Form.Item>
        <CommentFormItem label="Commit Message" name="comment" rules={[{ required: true }]}>
          <Input placeholder="Please Input commit message" />
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
      },
    })
  }, [
    componentType?.bromo.length,
    componentType?.nonBromo.length,
    dispatchers,
    saveForm,
    submitDeployConfig,
  ])

  const handleTriggerUpdateDeployConfig = (trigger: ValidateTriggers) => {
    isEditing &&
      setUpdateNewDeployConfigState({
        validateStatus: ValidateStatus.START,
        validateType: mySelectedMode === Mode.TEXT ? ValidateTypes.JSON : ValidateTypes.FORM,
        validateTrigger: trigger,
      })
  }

  const handleValidateFinish = React.useCallback(
    (state: IUpdateNewDeployConfig) => setUpdateNewDeployConfigState(state),
    [],
  )

  const handleToStorage = () => {
    const element = document.getElementById('storage')
    element.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (
      updateNewDeployConfigState &&
      updateNewDeployConfigState.validateStatus === ValidateStatus.SUCCESS
    ) {
      const { validateTrigger } = updateNewDeployConfigState
      const { storage } = newDeployConfig
      const { volumes = [] } = storage || {}

      const isStorageHasNullPvc =
        storage !== undefined &&
        volumes.some((volume) => volume?.pvcs?.some((pvcItem) => pvcItem.pvc === ''))

      switch (validateTrigger) {
        case ValidateTriggers.VIEW_MODE_CHANGE:
          setUpdateNewDeployConfigState(undefined)
          break
        case ValidateTriggers.CODE_DIFF_VIEW:
          setIsModalVisible(true)
          setUpdateNewDeployConfigState(undefined)
          break
        case ValidateTriggers.SAVE:
          if (isStorageHasNullPvc) {
            Modal.confirm({
              title: 'Notice',
              icon: null,
              content: (
                <Alert
                  message="Some AZs has not set Storage, please double check. If you make sure these AZ do not use Storage, please click Confirm to continue."
                  type="warning"
                  showIcon
                />
              ),
              okText: 'Confirm',
              cancelText: 'Back to Check',
              width: 600,
              onOk() {
                handleSave()
              },
              onCancel: handleToStorage,
            })
          } else {
            handleSave()
          }
          setUpdateNewDeployConfigState(undefined)
          break
        default:
          break
      }
    }
  }, [handleSave, updateNewDeployConfigState])

  const isSpinning =
    listHybridTenantsLoading ||
    listCommitsLoading ||
    updateNewDeployConfigState?.validateStatus === ValidateStatus.START

  const [loadMoreing, setLoadMoreing] = React.useState(false)
  const onLoadMore = async () => {
    setLoadMoreing(true)
    const { commits: newCommits } = await fetch['GET/api/ecp-cmdb/deploy-config/commits']({
      env,
      serviceId,
      page: page + 1,
      limit: 30,
    })
    setCommits([...commits.concat(newCommits)])
    setPage(page + 1)
    setLoadMoreing(false)
  }
  const loadMore =
    commits.length < totalCommits ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null
  const handleVersionClick = (item: ICurrentCommit) => {
    if (item.id !== currentCommit.id) {
      Object.values(deployConfigForms).forEach((form) => {
        form?.resetFields()
      })
      dispatchers.updateCurrentCommit(item)
      const deployConfig = commits.find((commit) => commit.id === item.id)?.data
      dispatchers.updateDeployConfig(deployConfig)
    }
  }

  return (
    <Root ref={containerWrapRef}>
      <RouteSetRegion />
      <Prompt when={!!isEditing}>
        <DeployConfigContext.Provider value={{ state, dispatch }}>
          <Row style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Alert
                message="ECP has alreay merged Deploy Config for both Bromo and SZ Kubernetes Deployments. If you have any questions, please ask ECP team for help."
                type="info"
                showIcon
                closable
              />
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <VersionList
                style={{
                  height: mySelectedMode === Mode.FORM ? 'unset' : 'calc(100vh - 190px)',
                }}
                $isEditing={isEditing}
                bordered
                className="demo-loadmore-list"
                itemLayout="horizontal"
                header={<>Version ({totalCommits})</>}
                loadMore={loadMore}
                dataSource={commits}
                renderItem={(item: ICurrentCommit) => (
                  <List.Item
                    onClick={() => handleVersionClick(item)}
                    style={{ backgroundColor: currentCommit?.id === item.id ? '#f4f9ff' : null }}
                  >
                    <Skeleton avatar title loading={loadMoreing} active>
                      <CommitTitle>
                        {item.id} - {item.comment}
                      </CommitTitle>
                      <List.Item.Meta
                        avatar={<Avatar src={`/api/avatar/${item.created_by}`} />}
                        title={item.created_by}
                        description={moment(item.created_time).format('YYYY/MM/DD HH:mm:ss')}
                      />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={20}>
              <ContentWrap ref={contentWrapRef}>
                <Spin spinning={isSpinning}>
                  {currentCommit ? (
                    <Title>
                      {currentCommit?.id} - {currentCommit?.comment}
                    </Title>
                  ) : null}
                  {mySelectedMode === Mode.FORM ? (
                    <>
                      <FormAnchor containerNode={contentWrapRef.current} />
                      <ListView
                        tenantId={tenantId}
                        updateNewDeployConfigState={updateNewDeployConfigState}
                        onValidateFinish={handleValidateFinish}
                        serviceId={serviceId}
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
            </Col>
          </Row>
          <StyledRow
            style={{
              visibility: isEditing ? 'visible' : 'hidden',
              height: isEditing ? '56px' : '0',
            }}
            justify="center"
            align="middle"
            gutter={16}
          >
            <Col>
              <Button
                onClick={() => handleTriggerUpdateDeployConfig(ValidateTriggers.CODE_DIFF_VIEW)}
              >
                Code Preview
              </Button>
            </Col>
            <Col>
              <Button onClick={() => handleCancelEdit()}>Cancel</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => handleTriggerUpdateDeployConfig(ValidateTriggers.SAVE)}
                disabled={!canEditConfig}
              >
                Save
              </Button>
            </Col>
          </StyledRow>
        </DeployConfigContext.Provider>
      </Prompt>
      <StyledModal
        title="Preview"
        width="80%"
        visible={isModalVisible}
        bodyStyle={{ overflowY: 'scroll' }}
        getContainer={() => document.body}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <CenterTextWrapper key="footer">
            <StyledButton type="primary" onClick={() => setIsModalVisible(false)}>
              OK
            </StyledButton>
          </CenterTextWrapper>,
        ]}
      >
        <ReactDiffViewer
          oldValue={JSON.stringify(deployConfig, null, 2)}
          newValue={JSON.stringify(newDeployConfig, null, 2)}
          splitView
          compareMethod={DiffMethod.WORDS_WITH_SPACE}
          showDiffOnly={false}
        />
      </StyledModal>
    </Root>
  )
}

export default DeployConfig

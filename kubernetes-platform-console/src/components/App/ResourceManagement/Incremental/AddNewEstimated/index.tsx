import { EVALUATION_METRICS_TYPE } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import {
  StyledInput,
  Title,
  SectionWrapper,
  StyledForm as Form,
  StyledInputNumber
} from 'components/App/ResourceManagement/Incremental/AddNewEstimated/style'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { NON_NEGATIVE_NUMBER } from 'helpers/validate'
import { GlobalContext } from 'hocs/useGlobalContext'
import { InputRef, message, Modal, ModalProps, PaginationProps, Select } from 'infrad'
import { find } from 'lodash'
import * as React from 'react'
import { sduResourceControllerCreateIncrementEstimate } from 'swagger-api/v1/apis/SduResource'
import { IFrontEndIncrement } from 'swagger-api/v1/models'
interface IAddNewEstimatedProps extends ModalProps {
  isVisible: boolean
  refresh: (fromBeginning?: boolean, targetPagination?: PaginationProps) => void
  duplicateRecord?: IFrontEndIncrement
}
interface ILevelOptions {
  label: string
  id: string
}
const AddNewEstimatedModal: React.FC<IAddNewEstimatedProps> = ({
  isVisible,
  onOk,
  onCancel,
  refresh,
  duplicateRecord
}) => {
  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const { state } = React.useContext(ResourceContext)
  const { cids, envs, azs, clusters, labelTree, machineModels, segments } = state
  const level1Options = React.useMemo(() => {
    return labelTree.map(level1 => {
      return {
        label: level1.displayName,
        id: level1.labelNodeId
      }
    })
  }, [labelTree])
  const [level2Options, setLevel2Options] = React.useState<ILevelOptions[]>([])
  const [level3Options, setLevel3Options] = React.useState<ILevelOptions[]>([])
  const [form] = Form.useForm()

  // Duplicate record. Initialise the form data
  React.useEffect(() => {
    if (duplicateRecord) {
      const { metaData, data } = duplicateRecord || {}
      const { level1, level2, level3 } = metaData || {}
      const { basicInfo, estimated } = data || {}
      const { cid, az, displayEnv, cluster, segment } = basicInfo || {}
      const {
        evaluationMetrics,
        cpuLimitOneInsPeak,
        memLimitOneInsPeak,
        gpuCardLimitOneInsPeak,
        minInsCount,
        remark,
        estimatedCpuIncrementTotal,
        estimatedMemIncrementTotal,
        qpsMaxOneIns,
        estimatedQpsTotal,
        estimatedLogic,
        machineModel
      } = estimated || {}
      const level1Id = find(level1Options, ['label', level1])?.id

      const level2Tree = find(labelTree, ['labelNodeId', level1Id])
      const level2Options = level2Tree?.childNodes?.map(level2 => {
        return {
          label: level2.displayName,
          id: level2.labelNodeId
        }
      })
      setLevel2Options(level2Options)
      // Level2 and level3 might be empty. In that case, the options would be like
      // {
      //   label: '-',
      //   id: 'asdsdasdadqdq'
      // }
      const level2Id = find(level2Options, ['label', level2 || '-'])?.id

      const level3Tree = find(level2Tree?.childNodes, ['labelNodeId', level2Id])
      const level3Options = level3Tree?.childNodes?.map(level3 => {
        return {
          label: level3.displayName,
          id: level3.labelNodeId
        }
      })
      setLevel3Options(level3Options)
      const level3Id = find(level3Options, ['label', level3 || '-'])?.id

      form.setFieldsValue({
        level1: level1Id,
        level2: level2Id,
        level3: level3Id,
        cid,
        az,
        displayEnv,
        cluster,
        segment,
        evaluationMetrics,
        cpuLimitOneInsPeak,
        memLimitOneInsPeak,
        gpuCardLimitOneInsPeak,
        minInsCount,
        remark,
        estimatedCpuIncrementTotal,
        estimatedMemIncrementTotal,
        qpsMaxOneIns,
        estimatedQpsTotal,
        estimatedLogic,
        machineModel
      })
    }
  }, [duplicateRecord, form, labelTree, level1Options])

  const estimatedInstanceCountRef = React.useRef<InputRef>(null)
  const handleAddNewEstimated = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    form.setFieldsValue({ gpuCardLimitOneInsPeak: 0 })
    const values = await form.validateFields()
    const payload = {
      data: [values]
    }
    try {
      await sduResourceControllerCreateIncrementEstimate({ payload })
      message.success('Add new estimated successfully')
      refresh()
      form.resetFields()
      setLevel2Options([])
      setLevel3Options([])
      onOk(e)
    } catch (e) {
      e.message && message.error(e.message)
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    form.resetFields()
    onCancel(e)
    setLevel2Options([])
    setLevel3Options([])
  }

  // Don't use should update to render because in that case we have to use setFieldsValue to reset fields in
  // Form.Item, which is not allowed
  const handleLevel1Select = (level1Id: string) => {
    const level2Tree = find(labelTree, { labelNodeId: level1Id })
    const level2s = level2Tree?.childNodes?.map(level2 => {
      return {
        label: level2.displayName,
        id: level2.labelNodeId
      }
    })
    setLevel2Options(level2s)
    setLevel3Options([])
    form.setFieldsValue({ level2: '', level3: '' })
  }

  const handleLevel2Select = (level2Id: string) => {
    const level1Id = form.getFieldValue('level1')
    const level2Tree = find(labelTree, { labelNodeId: level1Id })

    const level3Tree = find(level2Tree?.childNodes, { labelNodeId: level2Id })
    const level3s = level3Tree?.childNodes?.map(level3 => {
      return {
        label: level3.displayName,
        id: level3.labelNodeId
      }
    })
    setLevel3Options(level3s)
    form.setFieldsValue({ level3: '' })
  }
  return (
    <Modal
      visible={isVisible}
      title='Add New Estimated'
      width='600px'
      getContainer={() => document.body}
      okText='Confirm'
      onCancel={e => handleCancel(e)}
      onOk={e => handleAddNewEstimated(e)}
      bodyStyle={{ height: '800px', overflowY: 'scroll' }}
      style={{ top: 160 }}
    >
      <Form
        form={form}
        title='Add New Estimated'
        name='addNewEstimated'
        colon
        labelCol={{ offset: 0, span: 12 }}
        wrapperCol={{ offset: 1, span: 24 }}
      >
        <SectionWrapper>
          <Title>Project</Title>
          <Form.Item label='Level 1 Project' name='level1' rules={[{ required: true }]}>
            <Select style={{ width: 220 }} onSelect={handleLevel1Select}>
              {level1Options.map(level1 => (
                <Select.Option value={level1.id} key={level1.id}>
                  {level1.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Level 2 Project' name='level2' rules={[{ required: true }]}>
            <Select style={{ width: 220 }} onSelect={handleLevel2Select}>
              {level2Options?.map(level2 => (
                <Select.Option value={level2.id} key={level2.id}>
                  {level2.label || ' '}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Level 3 Project' name='level3'>
            <Select style={{ width: 220 }}>
              {level3Options?.map(level3 => (
                <Select.Option value={level3.id} key={level3.id}>
                  {level3.label || ' '}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </SectionWrapper>

        <SectionWrapper>
          <Title>Basic Info</Title>
          <Form.Item label='Cid' name='cid' required={true}>
            <Select style={{ width: 120 }}>
              {cids.map(cid => (
                <Select.Option value={cid} key={cid}>
                  {cid}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Env' name='displayEnv' rules={[{ required: true }]}>
            <Select style={{ width: 120 }}>
              {envs.map(env => (
                <Select.Option value={env} key={env}>
                  {env}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='AZ' name='az' rules={[{ required: true }]}>
            <Select style={{ width: 220 }}>
              {azs.map(az => (
                <Select.Option value={az} key={az}>
                  {az}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='Cluster'
            name='cluster'
            tooltip={{
              title:
                'If you have special requirements, enter the cluster name. Otherwise, resources will be allocated to the cluster that meets the requirements in the AZ',
              getPopupContainer: () => document.body
            }}
          >
            <Select style={{ width: 220 }} allowClear>
              {clusters.map(cluster => (
                <Select.Option value={cluster} key={cluster}>
                  {cluster}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Segment' name='segment' rules={[{ required: true }]}>
            <Select style={{ width: 220 }}>
              {segments.map(segment => (
                <Select.Option value={segment} key={segment}>
                  {segment}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </SectionWrapper>

        <SectionWrapper>
          <Title>Referenece</Title>
          <Form.Item
            label='Evaluation metrics'
            name='evaluationMetrics'
            required={true}
            initialValue={EVALUATION_METRICS_TYPE.CPU}
          >
            <Select style={{ width: 120 }}>
              {Object.values(EVALUATION_METRICS_TYPE).map(value => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='CPU limit per instance (Cores)'
            name='cpuLimitOneInsPeak'
            rules={[
              { required: true },
              {
                type: 'number',
                min: 0,
                message: 'Please input a non-negative number'
              }
            ]}
          >
            <StyledInputNumber placeholder='Input' controls={false} />
          </Form.Item>
          <Form.Item
            label='Memory limit per instance (GB)'
            name='memLimitOneInsPeak'
            rules={[
              { required: true },
              {
                type: 'number',
                min: 0,
                message: 'Please input a non-negative number'
              }
            ]}
          >
            <StyledInputNumber placeholder='Input' controls={false} />
          </Form.Item>
          <Form.Item
            label='GPU cards limit per instance (Cards)'
            name='gpuCardLimitOneInsPeak'
            hidden
            rules={[
              { required: false },
              {
                type: 'number',
                min: 0,
                message: 'Please input a non-negative number'
              }
            ]}
          >
            <StyledInputNumber placeholder='Input' controls={false} />
          </Form.Item>
          <Form.Item
            label='Minimum instance count'
            name='minInsCount'
            initialValue={2}
            rules={[
              { required: true },
              {
                pattern: NON_NEGATIVE_NUMBER,
                message: 'Please input a non-negative integer'
              }
            ]}
          >
            <StyledInputNumber placeholder='Input' controls={false} />
          </Form.Item>
          <Form.Item label='Remark' name='remark'>
            <StyledInput placeholder='Input' />
          </Form.Item>
        </SectionWrapper>

        <SectionWrapper>
          <Title>Estimated</Title>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.evaluationMetrics !== curValues.evaluationMetrics}
          >
            {({ getFieldValue }) => {
              const evaluationMetrics = getFieldValue('evaluationMetrics')
              const isEnable = evaluationMetrics === EVALUATION_METRICS_TYPE.CPU
              return (
                <Form.Item
                  label='Required CPU Increment (Cores)'
                  name='estimatedCpuIncrementTotal'
                  rules={[
                    { required: isEnable },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Please input a non-negative number'
                    }
                  ]}
                >
                  <StyledInputNumber disabled={!isEnable} controls={false} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.evaluationMetrics !== curValues.evaluationMetrics}
          >
            {({ getFieldValue }) => {
              const evaluationMetrics = getFieldValue('evaluationMetrics')
              const isEnable = evaluationMetrics === EVALUATION_METRICS_TYPE.MEM
              return (
                <Form.Item
                  label='Required Mem Increment (GB)'
                  name='estimatedMemIncrementTotal'
                  rules={[
                    { required: isEnable },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Please input a non-negative number'
                    }
                  ]}
                >
                  <StyledInputNumber disabled={!isEnable} controls={false} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.evaluationMetrics !== curValues.evaluationMetrics}
          >
            {({ getFieldValue }) => {
              const evaluationMetrics = getFieldValue('evaluationMetrics')
              const isEnable = evaluationMetrics === EVALUATION_METRICS_TYPE.QPS
              return (
                <>
                  <Form.Item
                    label='Max safe QPS for support per instance'
                    name='qpsMaxOneIns'
                    rules={[
                      { required: isEnable },
                      {
                        type: 'number',
                        min: 0,
                        message: 'Please input a non-negative number'
                      }
                    ]}
                  >
                    <StyledInputNumber disabled={!isEnable} controls={false} />
                  </Form.Item>
                  <Form.Item
                    label='Total required QPS'
                    name='estimatedQpsTotal'
                    rules={[
                      { required: isEnable },
                      {
                        type: 'number',
                        min: 0,
                        message: 'Please input a non-negative number'
                      }
                    ]}
                  >
                    <StyledInputNumber disabled={!isEnable} controls={false} />
                  </Form.Item>
                </>
              )
            }}
          </Form.Item>

          <Form.Item label='Required logic description' name='estimatedLogic' rules={[{ required: true }]}>
            <StyledInput placeholder='Input' />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => {
              return (
                prevValues.evaluationMetrics !== curValues.evaluationMetrics ||
                prevValues.minInsCount !== curValues.minInsCount ||
                prevValues.estimatedCpuIncrementTotal !== curValues.estimatedCpuIncrementTotal ||
                prevValues.cpuLimitOneInsPeak !== curValues.cpuLimitOneInsPeak ||
                prevValues.estimatedMemIncrementTotal !== curValues.estimatedMemIncrementTotal ||
                prevValues.memLimitOneInsPeak !== curValues.memLimitOneInsPeak ||
                prevValues.estimatedQpsTotal !== curValues.estimatedQpsTotal ||
                prevValues.qpsMaxOneIns !== curValues.qpsMaxOneIns
              )
            }}
          >
            {({ getFieldValue }) => {
              const evaluationMetrics = getFieldValue('evaluationMetrics')
              const minInsCount = getFieldValue('minInsCount')

              const estimatedCpuIncrementTotal = getFieldValue('estimatedCpuIncrementTotal')
              const cpuLimitOneInsPeak = getFieldValue('cpuLimitOneInsPeak')

              const estimatedMemIncrementTotal = getFieldValue('estimatedMemIncrementTotal')
              const memLimitOneInsPeak = getFieldValue('memLimitOneInsPeak')

              const estimatedQpsTotal = getFieldValue('estimatedQpsTotal')
              const qpsMaxOneIns = getFieldValue('qpsMaxOneIns')

              let estimatedInstanceCount
              switch (evaluationMetrics) {
                case EVALUATION_METRICS_TYPE.CPU:
                  estimatedInstanceCount =
                    Math.max(minInsCount, Math.ceil(estimatedCpuIncrementTotal / cpuLimitOneInsPeak)) || undefined
                  break
                case EVALUATION_METRICS_TYPE.MEM:
                  estimatedInstanceCount =
                    Math.max(minInsCount, Math.ceil(estimatedMemIncrementTotal / memLimitOneInsPeak)) || undefined
                  break
                case EVALUATION_METRICS_TYPE.QPS:
                  estimatedInstanceCount =
                    Math.max(minInsCount, Math.ceil(estimatedQpsTotal / qpsMaxOneIns)) || undefined
                  break
                default:
                  break
              }
              return (
                <Form.Item label='Estimated instance count'>
                  <StyledInput disabled={true} value={estimatedInstanceCount} ref={estimatedInstanceCountRef} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const cpuLimitOneInsPeak = getFieldValue('cpuLimitOneInsPeak')
              const estimatedCpuIncrement =
                cpuLimitOneInsPeak * Number(estimatedInstanceCountRef?.current?.input?.value) || undefined
              return (
                <Form.Item label='Estimated CPU increment (Cores)'>
                  <StyledInput disabled={true} value={estimatedCpuIncrement?.toFixed(2)} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const memLimitOneInsPeak = getFieldValue('memLimitOneInsPeak')
              const estimatedMemoryIncrement =
                memLimitOneInsPeak * Number(estimatedInstanceCountRef?.current?.input?.value) || undefined
              return (
                <Form.Item label='Estimated memory increment (GB)'>
                  <StyledInput disabled={true} value={estimatedMemoryIncrement?.toFixed(2)} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate hidden>
            {({ getFieldValue }) => {
              const gpuCardLimitOneInsPeak = getFieldValue('gpuCardLimitOneInsPeak')
              const estimatedGpuIncrement =
                gpuCardLimitOneInsPeak * Number(estimatedInstanceCountRef?.current?.input?.value) || undefined
              return (
                <Form.Item label='Estimated GPU increment (Cards)'>
                  <StyledInput disabled={true} value={estimatedGpuIncrement?.toFixed(2)} />
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            hidden={!isPlatformAdmin}
            label='Machine model'
            name='machineModel'
            initialValue='S1_V2'
            rules={[{ required: true }]}
          >
            <Select style={{ width: '120px' }}>
              {machineModels.map(machineModel => (
                <Select.Option value={machineModel} key={machineModel}>
                  {machineModel}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </SectionWrapper>
      </Form>
    </Modal>
  )
}

export default AddNewEstimatedModal

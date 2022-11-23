import React from 'react'
import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'

import {
  ContentWrapper,
  CountWrapper,
  FlexWrapper,
  HintMessage,
  StyledForm,
  TabelTitle
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CanaryDeployment/style'
import { Radio, Alert, Form } from 'infrad'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import {
  CountTableAzWrapper,
  StyledTable
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/CommonStyles/CountTable'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers,
  UNIT_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import { HorizonCenterWrapper } from 'common-styles/flexWrapper'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import {
  AutoDisabledInput,
  AutoDisabledInputNumber,
  AutoDisabledRadioGroup,
  AutoDisabledSwitch
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE, NON_NEGATIVE_NUMBER } from 'helpers/validate'
import { StringParam, useQueryParam } from 'use-query-params'
import { find } from 'lodash'
import { ICountryAZ } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CountryAZ'
import { normalizeNumber } from 'helpers/normalize'
import { NamePath } from 'infrad/lib/form/interface'

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const NON_NEGATIVE_FIELD_VALIDATOR = { pattern: NON_NEGATIVE_NUMBER, message: 'Please fill in a non-negative number' }
const INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE_FIELD_VALIDATOR = {
  pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
  message: 'Please fill in a number or percentage'
}

const notice = (
  <div style={{ width: '800px' }}>
    If there are components have the ability to canary in multiple-stages(Component - Advanced Config mapping info for
    details)，you can turn on the switch to override their canary mode into “multiple-stages” mode.
  </div>
)
const CanaryDeployment: React.FC = () => {
  const [form] = StyledForm.useForm()
  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)
  const env = selectedEnv?.toLocaleLowerCase()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, deployConfigForms, componentType, countryAzsOptions } = state
  const { cluster_instance, instances, strategy } = newDeployConfig
  const idcForm = deployConfigForms[FORM_TYPE.COUNTRY_AZ]

  // Instances has a property of 'canary_percent' or 'canary' indicating multiple-stages canary switch is enabled
  const initialMultiStage = React.useCallback(() => {
    const availableInstances = instances || []
    const finalCanaryTargetType = Object.keys(availableInstances).includes(UNIT_TYPE.CANARY_PERCENT)
      ? UNIT_TYPE.CANARY_PERCENT
      : UNIT_TYPE.CANARY
    const multiStageType = strategy?.parameters?.canary_stages?.[0].toString().includes('%')
      ? UNIT_TYPE.CANARY_PERCENT
      : UNIT_TYPE.CANARY
    const isMultipleStagesCanary =
      Object.keys(availableInstances).includes(UNIT_TYPE.CANARY) ||
      Object.keys(availableInstances).includes(UNIT_TYPE.CANARY_PERCENT)

    form.setFieldsValue({ multiStageType, isMultipleStagesCanary })
    if (isMultipleStagesCanary) {
      const idc = Object.values(availableInstances[finalCanaryTargetType])[0]
      const initialFinalTarget = Object.values(idc)[0]
      const canaryStages =
        multiStageType === UNIT_TYPE.CANARY
          ? strategy?.parameters?.canary_stages
          : strategy?.parameters?.canary_stages?.map(stage => parseInt(stage))
      form.setFieldsValue({
        finalCanaryTarget: finalCanaryTargetType === UNIT_TYPE.CANARY ? initialFinalTarget : `${initialFinalTarget}%`,
        stageCount: canaryStages
      })
    } else {
      form.setFieldsValue({ finalCanaryTarget: undefined, stageCount: undefined })
    }
  }, [form, instances, strategy?.parameters?.canary_stages])

  React.useEffect(() => {
    if (idcForm) {
      const idcs = idcForm.getFieldValue(['idcs', env]).filter((idc: ICountryAZ[] | undefined) => idc !== undefined)
      const data = idcs.map((idc: ICountryAZ) => {
        const countArray = idc.azs?.map(az => {
          const target = find(cluster_instance, { cid: idc.cid, idc: az })
          const count = target?.canary_init_count
          return {
            [az]: count || 1
          }
        })
        const canaryCount = countArray?.reduce((acc: Record<string, number>, curr: Record<string, number>) => {
          return { ...acc, ...curr }
        }, {})
        return {
          cid: idc.cid,
          ...canaryCount
        }
      })
      form.setFieldsValue({ initialCanaryCount: data })
    }

    initialMultiStage()
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.CANARY_DEPLOYMENT]: form })
    dispatchers.updateErrors(FORM_TYPE.CANARY_DEPLOYMENT)
  }, [cluster_instance, dispatchers, env, form, idcForm, instances, countryAzsOptions, initialMultiStage])

  const initialCanaryCountColumns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '10%',
      render: (_, record: FormListFieldData) => {
        return (
          <Form.Item name={[record.name, 'cid']}>
            <AutoDisabledInput readOnly={true} bordered={false} style={{ width: '100px' }} />
          </Form.Item>
        )
      }
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      width: '30%',
      render: (_, record: FormListFieldData) => {
        const azs = idcForm?.getFieldValue(['idcs', env, record.name, 'azs']) || []
        return (
          <FlexWrapper>
            {azs.map(az => (
              <CountWrapper key={az}>
                <Form.Item>
                  <CountTableAzWrapper>{az}</CountTableAzWrapper>
                </Form.Item>
                <Form.Item
                  name={[record.name, az]}
                  rules={[
                    {
                      pattern: NON_NEGATIVE_NUMBER,
                      message: 'Please input a non-negative number'
                    }
                  ]}
                  normalize={value => normalizeNumber(value)}
                >
                  <AutoDisabledInput style={{ width: '100px' }} />
                </Form.Item>
              </CountWrapper>
            ))}
          </FlexWrapper>
        )
      }
    }
  ]

  const stageCountColumns = [
    {
      title: 'No. ',
      dataIndex: 'stage',
      key: 'stage',
      width: '10%',
      render: (_: unknown, _record: FormListFieldData, index: number) => <Form.Item>{index}</Form.Item>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '20%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) => prevValues.multiStageType !== curValues.multiStageType}
        >
          {({ getFieldValue }) => {
            const stageCount = form.getFieldValue(['stageCount'])
            const dependencyArray: NamePath[] = stageCount.map((_, index: number) => {
              return ['stageCount', index]
            })
            const stageFormFormat = getFieldValue('multiStageType')
            return (
              <Form.Item
                dependencies={dependencyArray}
                name={[record.name]}
                validateFirst
                rules={[
                  COMPULSORY_FIELD_VALIDATOR,
                  NON_NEGATIVE_FIELD_VALIDATOR,
                  {
                    validator: () => {
                      const dataList = form.getFieldValue(['stageCount']).filter(element => element !== undefined)
                      const leftChunk = dataList.slice(0, record.name)
                      const rightChunk = dataList.slice(record.name + 1)
                      const isValid =
                        leftChunk.every(each => Number(each) < dataList[record.name]) &&
                        rightChunk.every(each => Number(each) > dataList[record.name])
                      if (!isValid) {
                        return Promise.reject()
                      }
                      return Promise.resolve()
                    },
                    message: 'Please enter valid stage value'
                  }
                ]}
              >
                {stageFormFormat === UNIT_TYPE.CANARY ? (
                  <AutoDisabledInput />
                ) : (
                  <AutoDisabledInputNumber stringMode style={{ width: '100%' }} min={0} max={100} />
                )}
              </Form.Item>
            )
          }}
        </Form.Item>
      )
    }
  ]

  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.CANARY_DEPLOYMENT)}>
      <SectionWrapper title='Canary Deployment' notice={notice} anchorKey={FORM_TYPE.CANARY_DEPLOYMENT}>
        <RowFormField hasBackground={false}>
          <Form.List name='initialCanaryCount'>
            {fields => (
              <StyledTable rowKey='name' columns={initialCanaryCountColumns} dataSource={fields} pagination={false} />
            )}
          </Form.List>
        </RowFormField>
        {componentType.bromo.length ? (
          <>
            <RowFormField rowKey='Multiple-Stages Canary' hasBackground={false}>
              <HorizonCenterWrapper>
                <Form.Item noStyle name='isMultipleStagesCanary' valuePropName='checked'>
                  <AutoDisabledSwitch />
                </Form.Item>
                <HintMessage>Multiple-Stages mode only work in Affected AZ(s)</HintMessage>
              </HorizonCenterWrapper>
            </RowFormField>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) =>
                prevValues.isMultipleStagesCanary !== curValues.isMultipleStagesCanary
              }
            >
              {({ getFieldValue }) => {
                const isMultipleStagesCanary = getFieldValue('isMultipleStagesCanary')
                return (
                  isMultipleStagesCanary && (
                    <>
                      <RowFormField hasBackground={false}>
                        <TabelTitle>Stage & Instance Count</TabelTitle>
                      </RowFormField>
                      <RowFormField>
                        <Form.Item label='Form' labelCol={{ span: 4 }}>
                          <Form.Item name='multiStageType'>
                            <AutoDisabledRadioGroup>
                              <Radio value={UNIT_TYPE.CANARY}>Number</Radio>
                              <Radio value={UNIT_TYPE.CANARY_PERCENT}>Percentage</Radio>
                            </AutoDisabledRadioGroup>
                          </Form.Item>
                          <Alert
                            showIcon
                            type='info'
                            message='Above percentage would be recommended to be used with replacement and canary replacement strategy enabled.'
                          />
                          <ContentWrapper>
                            <Form.List name='stageCount'>
                              {(fields, { add, remove }) => (
                                <TableFormList
                                  dataSource={fields}
                                  dataColumns={stageCountColumns}
                                  onAdd={add}
                                  onRemove={remove}
                                  canDeleteAll={false}
                                  formType={FORM_TYPE.CANARY_DEPLOYMENT}
                                />
                              )}
                            </Form.List>
                          </ContentWrapper>
                        </Form.Item>
                        <Form.Item label='Final Canary Target' labelCol={{ span: 4 }}>
                          <Form.Item
                            name='finalCanaryTarget'
                            validateFirst
                            rules={[COMPULSORY_FIELD_VALIDATOR, INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE_FIELD_VALIDATOR]}
                          >
                            <AutoDisabledInput style={{ width: '100px', marginLeft: '16px' }} />
                          </Form.Item>
                          <Alert
                            showIcon
                            type='info'
                            message='Provide the final absolute number or percentage of instance count with reference to the instance count you indicated in the instances section.'
                          />
                        </Form.Item>
                      </RowFormField>
                    </>
                  )
                )
              }}
            </Form.Item>
          </>
        ) : null}
      </SectionWrapper>
    </Form>
  )
}

export default CanaryDeployment

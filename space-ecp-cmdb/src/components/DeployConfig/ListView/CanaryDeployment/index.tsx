import React from 'react'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'

import {
  ContentWrapper,
  CountWrapper,
  FlexWrapper,
  HintMessage,
  StyledForm,
  TabelTitle,
} from 'src/components/DeployConfig/ListView/CanaryDeployment/style'
import { Radio, Alert, Form } from 'infrad'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import {
  CountTableAzWrapper,
  StyledTable,
} from 'src/components/DeployConfig/ListView/Common/CommonStyles/CountTable'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
  UnitType,
} from 'src/components/DeployConfig/useDeployConfigContext'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import { HorizonCenterWrapper } from 'src/common-styles/flexWrapper'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import {
  AutoDisabledInput,
  AutoDisabledInputNumber,
  AutoDisabledRadioGroup,
  AutoDisabledSwitch,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE, NON_NEGATIVE_NUMBER } from 'src/helpers/validate'
import { find } from 'lodash'
import { ICountryAZ } from 'src/components/DeployConfig/ListView/CountryAZ'
import { normalizeNumber } from 'src/helpers/normalize'
import { NamePath } from 'infrad/lib/form/interface'

export interface IInitialCanaryCount {
  cid: string
}

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const NON_NEGATIVE_FIELD_VALIDATOR = {
  pattern: NON_NEGATIVE_NUMBER,
  message: 'Please fill in a non-negative number',
}
const INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE_FIELD_VALIDATOR = {
  pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
  message: 'Please fill in a number or percentage',
}

const notice = (
  <div style={{ width: '800px' }}>
    If there are components have the ability to canary in multiple-stages(Component - Advanced
    Config mapping info for details)，you can turn on the switch to override their canary mode into
    “multiple-stages” mode.
  </div>
)
const CanaryDeployment: React.FC = () => {
  const [form] = StyledForm.useForm()

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, deployConfigForms, componentType, countryAzsOptions, env } = state
  const { cluster_instance, instances, strategy } = newDeployConfig
  const idcForm = deployConfigForms[FormType.COUNTRY_AZ]

  // Instances has a property of 'canary_percent' or 'canary' indicating multiple-stages canary switch is enabled
  const initialMultiStage = React.useCallback(() => {
    const availableInstances = instances || {}
    const finalCanaryTargetType = Object.keys(availableInstances).includes(UnitType.CANARY_PERCENT)
      ? UnitType.CANARY_PERCENT
      : UnitType.CANARY
    const multiStageType = strategy?.parameters?.canary_stages?.[0]?.toString().includes('%')
      ? UnitType.CANARY_PERCENT
      : UnitType.CANARY
    const isMultipleStagesCanary =
      (strategy?.parameters && strategy?.parameters?.canary_stages) ||
      Object.keys(availableInstances).includes(UnitType.CANARY_PERCENT)

    form.setFieldsValue({ multiStageType, isMultipleStagesCanary })
    if (isMultipleStagesCanary) {
      // @ts-expect-error rapper cannot handle complex object type
      const idc = Object.values(availableInstances[finalCanaryTargetType])[0]
      const initialFinalTarget = Object.values(idc)[0]
      const canaryStages =
        multiStageType === UnitType.CANARY
          ? strategy?.parameters?.canary_stages
          : strategy?.parameters?.canary_stages?.map((stage: string) => parseInt(stage))
      form.setFieldsValue({
        finalCanaryTarget:
          finalCanaryTargetType === UnitType.CANARY ? initialFinalTarget : `${initialFinalTarget}%`,
        stageCount: canaryStages,
      })
    } else {
      form.setFieldsValue({ finalCanaryTarget: undefined, stageCount: undefined })
    }
  }, [form, instances, strategy?.parameters])

  React.useEffect(() => {
    if (idcForm) {
      const idcs: ICountryAZ[] = idcForm
        .getFieldValue(['idcs', env])
        ?.filter((idc: ICountryAZ[] | undefined) => idc !== undefined)
      const data = idcs?.map((idc: ICountryAZ) => {
        const countArray = idc?.azs?.map((az) => {
          const target = find(cluster_instance, { cid: idc.cid, idc: az })
          const count = target?.canary_init_count
          return {
            [az]: count || 1,
          }
        })
        const canaryCount = countArray?.reduce(
          (acc: Record<string, number>, curr: Record<string, number>) => ({ ...acc, ...curr }),
          {},
        )
        return {
          cid: idc.cid,
          ...canaryCount,
        }
      })
      form.setFieldsValue({ initialCanaryCount: data })
    }

    initialMultiStage()
    dispatchers.updateDeployConfigForms({ [FormType.CANARY_DEPLOYMENT]: form })
    dispatchers.updateErrors(FormType.CANARY_DEPLOYMENT)
  }, [
    cluster_instance,
    dispatchers,
    env,
    form,
    idcForm,
    instances,
    countryAzsOptions,
    initialMultiStage,
  ])

  const initialCanaryCountColumns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '10%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'cid']}>
          <AutoDisabledInput readOnly bordered={false} style={{ width: '100px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      width: '30%',
      render: (_: unknown, record: FormListFieldData) => {
        const azs: string[] = idcForm?.getFieldValue(['idcs', env, record.name, 'azs']) || []
        return (
          <FlexWrapper>
            {azs.map((az) => (
              <CountWrapper key={az}>
                <Form.Item>
                  <CountTableAzWrapper az={az}>{az}</CountTableAzWrapper>
                </Form.Item>
                <Form.Item
                  name={[record.name, az]}
                  rules={[
                    {
                      pattern: NON_NEGATIVE_NUMBER,
                      message: 'Please input a non-negative number',
                    },
                  ]}
                  normalize={(value) => normalizeNumber(value)}
                >
                  <AutoDisabledInput style={{ width: '100px' }} />
                </Form.Item>
              </CountWrapper>
            ))}
          </FlexWrapper>
        )
      },
    },
  ]

  const stageCountColumns = [
    {
      title: 'No. ',
      dataIndex: 'stage',
      key: 'stage',
      width: '10%',
      render: (_: unknown, _record: FormListFieldData, index: number) => (
        <Form.Item>{index}</Form.Item>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '20%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.multiStageType !== curValues.multiStageType
          }
        >
          {({ getFieldValue }) => {
            const stageCount = form.getFieldValue(['stageCount'])
            const dependencyArray: NamePath[] = stageCount.map((_: unknown, index: number) => [
              'stageCount',
              index,
            ])
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
                      const dataList = form
                        .getFieldValue(['stageCount'])
                        .filter((element: unknown) => element !== undefined)
                      const leftChunk = dataList.slice(0, record.name)
                      const rightChunk = dataList.slice(record.name + 1)
                      const isValid =
                        leftChunk.every(
                          (each: number | string) => Number(each) < dataList[record.name],
                        ) &&
                        rightChunk.every(
                          (each: number | string) => Number(each) > dataList[record.name],
                        )
                      if (!isValid) {
                        return Promise.reject()
                      }
                      return Promise.resolve()
                    },
                    message: 'Please enter valid stage value',
                  },
                ]}
              >
                {stageFormFormat === UnitType.CANARY ? (
                  <AutoDisabledInput />
                ) : (
                  <AutoDisabledInputNumber stringMode style={{ width: '100%' }} min={0} max={100} />
                )}
              </Form.Item>
            )
          }}
        </Form.Item>
      ),
    },
  ]

  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FormType.CANARY_DEPLOYMENT)}>
      <SectionWrapper
        title="Canary Deployment"
        notice={notice}
        anchorKey={FormType.CANARY_DEPLOYMENT}
      >
        <RowFormField hasBackground={false}>
          <Form.List name="initialCanaryCount">
            {(fields) => (
              <StyledTable
                rowKey="name"
                columns={initialCanaryCountColumns}
                dataSource={fields}
                pagination={false}
              />
            )}
          </Form.List>
        </RowFormField>
        {componentType.bromo.length ? (
          <>
            <RowFormField rowKey="Multiple-Stages Canary" hasBackground={false}>
              <HorizonCenterWrapper>
                <Form.Item noStyle name="isMultipleStagesCanary" valuePropName="checked">
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
                        <Form.Item label="Form" labelCol={{ span: 4 }}>
                          <Form.Item name="multiStageType">
                            <AutoDisabledRadioGroup>
                              <Radio value={UnitType.CANARY}>Number</Radio>
                              <Radio value={UnitType.CANARY_PERCENT}>Percentage</Radio>
                            </AutoDisabledRadioGroup>
                          </Form.Item>
                          <Alert
                            showIcon
                            type="info"
                            message="Above percentage would be recommended to be used with replacement and canary replacement strategy enabled."
                          />
                          <ContentWrapper>
                            <Form.List name="stageCount">
                              {(fields, { add, remove }) => (
                                <TableFormList
                                  dataSource={fields}
                                  dataColumns={stageCountColumns}
                                  onAdd={add}
                                  onRemove={remove}
                                  canDeleteAll={false}
                                  formType={FormType.CANARY_DEPLOYMENT}
                                />
                              )}
                            </Form.List>
                          </ContentWrapper>
                        </Form.Item>
                        <Form.Item label="Final Canary Target" labelCol={{ span: 4 }}>
                          <Form.Item
                            name="finalCanaryTarget"
                            validateFirst
                            rules={[
                              COMPULSORY_FIELD_VALIDATOR,
                              INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE_FIELD_VALIDATOR,
                            ]}
                          >
                            <AutoDisabledInput style={{ width: '100px', marginLeft: '16px' }} />
                          </Form.Item>
                          <Alert
                            showIcon
                            type="info"
                            message="Provide the final absolute number or percentage of instance count with reference to the instance count you indicated in the instances section."
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

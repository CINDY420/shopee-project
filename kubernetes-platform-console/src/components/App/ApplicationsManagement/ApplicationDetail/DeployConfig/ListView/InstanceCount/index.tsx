import { NON_NEGATIVE_NUMBER } from 'helpers/validate'
import { Form } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import React from 'react'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import {
  CountWrapper,
  FlexWrapper
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CanaryDeployment/style'
import {
  CountTableAzWrapper,
  StyledTable
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/CommonStyles/CountTable'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import { AutoDisabledInput } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { StringParam, useQueryParam } from 'use-query-params'
import { normalizeNumber } from 'helpers/normalize'

const InstanceCount: React.FC = () => {
  const [form] = Form.useForm()
  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)
  const env = selectedEnv?.toLocaleLowerCase()

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { deployConfigForms, newDeployConfig, countryAzsOptions } = state
  const idcForm = deployConfigForms[FORM_TYPE.COUNTRY_AZ]
  const minimumInstanceForm = deployConfigForms[FORM_TYPE.MINIMUM_INSTANCE_COUNT]
  const { instances } = newDeployConfig

  const columns = [
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
            {azs.map(az => {
              return (
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
                      },
                      {
                        validator: () => {
                          const instanceCount = form?.getFieldValue(['instances', env, record.name, az])
                          const minimumInstanceCount = minimumInstanceForm?.getFieldValue([
                            'minimumInstance',
                            env,
                            record.name,
                            az
                          ])
                          const isValid = Number(minimumInstanceCount) <= Number(instanceCount)
                          if (!isValid) {
                            return Promise.reject()
                          }
                          return Promise.resolve()
                        },
                        message: 'Minimum instance count must be <= instance count'
                      }
                    ]}
                    normalize={value => normalizeNumber(value)}
                  >
                    <AutoDisabledInput style={{ width: '100px' }} />
                  </Form.Item>
                </CountWrapper>
              )
            })}
          </FlexWrapper>
        )
      }
    }
  ]

  React.useEffect(() => {
    if (idcForm) {
      const idcs = idcForm.getFieldValue(['idcs', env]).filter(idc => idc !== undefined)
      const data = idcs.map(idc => {
        const countArray = idc.azs?.map(az => {
          const count = instances?.[env]?.[idc.cid]?.[az]
          return {
            [az]: count ?? 1
          }
        })
        const instanceCount = countArray?.reduce((acc: Record<string, string>, curr: Record<string, string>) => {
          return { ...acc, ...curr }
        }, {})
        return {
          cid: idc.cid,
          ...instanceCount
        }
      })
      form.setFieldsValue({ instances: { [env]: data } })
    }
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.INSTANCE_COUNT]: form })
    dispatchers.updateErrors(FORM_TYPE.INSTANCE_COUNT)
  }, [dispatchers, env, form, idcForm, countryAzsOptions, instances])

  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.INSTANCE_COUNT)}>
      <SectionWrapper title='Instance Count' anchorKey={FORM_TYPE.INSTANCE_COUNT}>
        <RowFormField hasBackground={false}>
          <Form.List name={['instances', env]}>
            {fields => <StyledTable rowKey='name' columns={columns} dataSource={fields} pagination={false} />}
          </Form.List>
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}

export default InstanceCount

import { NON_NEGATIVE_NUMBER } from 'src/helpers/validate'
import { Form } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import React from 'react'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import {
  CountWrapper,
  FlexWrapper,
} from 'src/components/DeployConfig/ListView/CanaryDeployment/style'
import {
  CountTableAzWrapper,
  StyledTable,
} from 'src/components/DeployConfig/ListView/Common/CommonStyles/CountTable'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import { AutoDisabledInput } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { normalizeNumber } from 'src/helpers/normalize'
import { ICountryAZ } from 'src/components/DeployConfig/ListView/CountryAZ'

const MinimumInstanceCount: React.FC = () => {
  const [form] = Form.useForm()

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { deployConfigForms, newDeployConfig, countryAzsOptions, env } = state
  const { minimum_instances } = newDeployConfig

  const idcForm = deployConfigForms[FormType.COUNTRY_AZ]
  const instanceCountForm = deployConfigForms[FormType.INSTANCE_COUNT]

  const columns = [
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
                    {
                      validator: () => {
                        const instanceCount = instanceCountForm?.getFieldValue([
                          'instances',
                          env,
                          record.name,
                          az,
                        ])
                        const minimumInstanceCount = form.getFieldValue([
                          'minimumInstance',
                          env,
                          record.name,
                          az,
                        ])
                        const isValid = Number(minimumInstanceCount) <= Number(instanceCount)
                        if (!isValid) {
                          return Promise.reject()
                        }
                        return Promise.resolve()
                      },
                      message: 'Minimum instance count must be <= instance count',
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

  React.useEffect(() => {
    if (idcForm) {
      const idcs: ICountryAZ[] = idcForm
        .getFieldValue(['idcs', env])
        ?.filter((idc: ICountryAZ) => idc !== undefined)
      const data = idcs?.map((idc) => {
        const countArray = idc?.azs?.map((az) => {
          const formData = form.getFieldValue(['minimumInstance', env])
          const obj = formData?.find((each: { cid: string }) => each.cid === idc.cid)
          // @ts-expect-error rapper cannot handle Record<string, Record<string, Record<string, string>>>
          const count = obj?.[az] ?? minimum_instances?.[env]?.[idc.cid]?.[az]
          return {
            [az]: count ?? 0,
          }
        })
        const minimumInstanceCount = countArray?.reduce(
          (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
          {},
        )
        return {
          cid: idc.cid,
          ...minimumInstanceCount,
        }
      })
      form.setFieldsValue({ minimumInstance: { [env]: data } })
    }
    dispatchers.updateDeployConfigForms({ [FormType.MINIMUM_INSTANCE_COUNT]: form })
    dispatchers.updateErrors(FormType.MINIMUM_INSTANCE_COUNT)
  }, [dispatchers, env, form, idcForm, countryAzsOptions, minimum_instances])

  return (
    <Form
      form={form}
      onFieldsChange={() => dispatchers.updateErrors(FormType.MINIMUM_INSTANCE_COUNT)}
    >
      <SectionWrapper title="Minimum Instance Count" anchorKey={FormType.MINIMUM_INSTANCE_COUNT}>
        <RowFormField hasBackground={false}>
          <Form.List name={['minimumInstance', env]}>
            {(fields) => (
              <StyledTable rowKey="name" columns={columns} dataSource={fields} pagination={false} />
            )}
          </Form.List>
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}

export default MinimumInstanceCount

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
import { omit } from 'lodash'

type IFormType = {
  [az: string]: number | string
}

const InstanceCount: React.FC = () => {
  const [form] = Form.useForm()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { deployConfigForms, newDeployConfig, env, updatedCidAz, countryAzsOptions } = state
  const idcForm = deployConfigForms[FormType.COUNTRY_AZ]
  const minimumInstanceForm = deployConfigForms[FormType.MINIMUM_INSTANCE_COUNT]
  const { instances } = newDeployConfig

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
                        const instanceCount = form?.getFieldValue([
                          'instances',
                          env,
                          record.name,
                          az,
                        ])
                        const minimumInstanceCount = minimumInstanceForm?.getFieldValue([
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
    if (idcForm && !updatedCidAz) {
      const idcs: ICountryAZ[] = idcForm
        .getFieldValue(['idcs', env])
        ?.filter((idc: ICountryAZ) => idc !== undefined)
      const data = idcs?.map((idc) => {
        const countArray = idc?.azs?.map((az) => {
          const formData = form.getFieldValue(['instances', env])
          const obj = formData?.find((each: { cid: string }) => each.cid === idc.cid)
          // @ts-expect-error rapper cannot handle Record<string, Record<string, Record<string, string>>>
          const count = obj?.[az] ?? instances?.[env]?.[idc.cid]?.[az]
          return {
            [az]: count ?? 1,
          }
        })
        const instanceCount = countArray?.reduce(
          (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
          {},
        )
        return {
          cid: idc.cid,
          ...instanceCount,
        }
      })
      form.setFieldsValue({ instances: { [env]: data } })
    }
    dispatchers.updateDeployConfigForms({ [FormType.INSTANCE_COUNT]: form })
    dispatchers.updateErrors(FormType.INSTANCE_COUNT)
  }, [dispatchers, env, form, idcForm, countryAzsOptions, instances])

  React.useEffect(() => {
    if (updatedCidAz) {
      const { cid: updatedCid, az: updatedAz } = updatedCidAz
      const formValues: IFormType[] = form.getFieldValue(['instances', env])
      const index = formValues?.findIndex((each) => each.cid === updatedCid)
      if (index === -1) {
        formValues?.push({ cid: updatedCid, [updatedAz]: 1 })
      } else {
        const obj = formValues[index]
        const azCount = omit(obj, 'cid')
        const maxCount =
          Object.values(azCount).length !== 0
            ? Math.max(...Object.values(azCount).map((each) => Number(each)))
            : 1
        formValues[index][updatedAz] = maxCount
      }
      form.setFieldsValue({ instances: { [env]: formValues } })
    }
    dispatchers.recordUpdatedCidAz(undefined)
  }, [updatedCidAz])
  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FormType.INSTANCE_COUNT)}>
      <SectionWrapper title="Instance Count" anchorKey={FormType.INSTANCE_COUNT}>
        <RowFormField hasBackground={false}>
          <Form.List name={['instances', env]}>
            {(fields) => (
              <StyledTable rowKey="name" columns={columns} dataSource={fields} pagination={false} />
            )}
          </Form.List>
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}

export default InstanceCount

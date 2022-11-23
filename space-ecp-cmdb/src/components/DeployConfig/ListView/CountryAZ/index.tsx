import * as React from 'react'

import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import { Alert, Form, Select } from 'infrad'
import {
  DeployConfigContext,
  getDispatchers,
  FormType,
  FormAnchorKey,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { find } from 'lodash'
import { fetch } from 'src/rapper'

export interface ICountryAZ {
  cid: string
  azs: string[]
}

const NOTICE_ADDRESS =
  'https://confluence.shopee.io/pages/viewpage.action?pageId=917289060#heading-LiveAZstatus'

const CountryAZ: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, isEditing, env, cids } = state
  const { idcs } = newDeployConfig

  const [azs, setAzs] = React.useState<string[]>([])
  const [isAzChanged, setIsAzChanged] = React.useState<boolean>(false)

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        const idcs = form.getFieldValue(['idcs', env])

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect>
              {cids.map((item) => {
                const { key, label, value } = item
                const lowerCaseValue = value.toLowerCase()
                return (
                  <Select.Option
                    value={lowerCaseValue}
                    key={key}
                    disabled={find(idcs, ['cid', lowerCaseValue])}
                  >
                    {label}
                  </Select.Option>
                )
              })}
            </AutoDisabledSelect>
          </Form.Item>
        )
      },
    },
    {
      title: 'AZ',
      dataIndex: 'azs',
      key: 'azs',
      width: '84%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        const cid: string = form?.getFieldValue(['idcs', env, record.name, 'cid'])
        return (
          <Form.Item
            {...restField}
            name={[name, 'azs']}
            rules={[{ required: true, message: 'Please fill in your target AZ(s)' }]}
          >
            <AutoDisabledSelect
              mode="multiple"
              showArrow
              onSelect={(az: string) => handleAzAdded(cid, az)}
            >
              {azs.map((az) => (
                <Select.Option value={az} key={az}>
                  {az}
                </Select.Option>
              ))}
            </AutoDisabledSelect>
          </Form.Item>
        )
      },
    },
  ]

  React.useEffect(() => {
    setIsAzChanged(false)
    dispatchers.updateDeployConfigForms({ [FormType.COUNTRY_AZ]: form })
  }, [dispatchers, form, isEditing])

  const getInitialCountryAzsOptions = React.useCallback(async () => {
    if (env) {
      const { availableZones } = await fetch['GET/api/ecp-cmdb/deploy-config/available-zones']({
        env,
      })

      const azs = availableZones.map((item) => item.name)
      setAzs(azs)
    }
  }, [env])

  React.useEffect(() => {
    getInitialCountryAzsOptions()
  }, [getInitialCountryAzsOptions])

  const initializeFormValues = React.useCallback(() => {
    // @ts-expect-error rapper cannot handle complex object type
    const idcsValues = idcs?.[env] || {}
    const formatIdcs = Object.entries(idcsValues).map(([cid, azs]: [string, string[]]) => ({
      cid,
      azs,
    }))
    form.setFieldsValue({
      idcs: {
        [env]: formatIdcs,
      },
    })
    dispatchers.updateErrors(FormType.COUNTRY_AZ)
    dispatchers.updateCountryAzsOptions(idcsValues)
  }, [dispatchers, env, form, idcs])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  const handleAzAdded = (cid: string, az: string) => {
    setIsAzChanged(true)
    dispatchers.recordUpdatedCidAz({ cid, az })
  }

  const handleValuesChange = (_: unknown, allvalues: { idcs: Record<string, ICountryAZ[]> }) => {
    const { idcs } = allvalues
    const options = idcs?.[env]?.reduce((obj: Record<string, string[]>, item) => {
      if (item?.cid) {
        obj[item.cid] = item?.azs
      }
      return obj
    }, {})
    dispatchers.updateCountryAzsOptions(options)
  }

  return (
    <SectionWrapper
      title={FormType.COUNTRY_AZ}
      anchorKey={FormType.COUNTRY_AZ}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for more CID - AZ mapping info
        </>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        requiredMark={false}
        onValuesChange={handleValuesChange}
        onFieldsChange={() => dispatchers.updateErrors(FormType.COUNTRY_AZ)}
      >
        {isAzChanged && (
          <Alert
            style={{ width: '85%' }}
            showIcon
            type="warning"
            message={
              <>
                AZ changed. Please make sure the instance count of new AZs are correct. To{' '}
                <a
                  href={`#${FormAnchorKey[FormType.INSTANCE_COUNT]}`}
                  style={{ textDecoration: 'underline' }}
                >
                  Instance Count
                </a>
                .
              </>
            }
          />
        )}
        <RowFormField>
          <Form.List name={['idcs', env]}>
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                canDeleteAll={false}
                formType={FormType.COUNTRY_AZ}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default CountryAZ

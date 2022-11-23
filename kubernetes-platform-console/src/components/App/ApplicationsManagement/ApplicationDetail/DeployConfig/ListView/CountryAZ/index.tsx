import * as React from 'react'

import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import { Form, Select } from 'infrad'
import {
  DeployConfigContext,
  getDispatchers,
  FORM_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { find } from 'lodash'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
import { deployConfigControllerListAvailableZones } from 'swagger-api/v1/apis/DeployConfig'
import { globalControllerGetCids } from 'swagger-api/v3/apis/Global'
import { StringParam, useQueryParam } from 'use-query-params'

export interface ICountryAZ {
  cid: string
  azs: string[]
}

const NOTICE_ADDRESS = 'https://confluence.shopee.io/pages/viewpage.action?pageId=917289060#heading-LiveAZstatus'

const CountryAZ: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, isEditing } = state
  const { idcs } = newDeployConfig
  const application = useRecoilValue(selectedApplication)
  const { tenantId, projectName, name: appName } = application

  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)
  const env = selectedEnv?.toLowerCase()

  const [cids, setCids] = React.useState<string[]>([])
  const [azs, setAzs] = React.useState<string[]>([])

  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record
        const idcs = form.getFieldValue(['idcs', env])

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect>
              {cids.map(item => {
                const cid = item.toLowerCase()
                return (
                  <Select.Option value={cid} key={cid} disabled={find(idcs, ['cid', cid])}>
                    {cid}
                  </Select.Option>
                )
              })}
            </AutoDisabledSelect>
          </Form.Item>
        )
      }
    },
    {
      title: 'AZ',
      dataIndex: 'azs',
      key: 'azs',
      width: '84%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item
            {...restField}
            name={[name, 'azs']}
            rules={[{ required: true, message: 'Please fill in your target AZ(s)' }]}
          >
            <AutoDisabledSelect mode='multiple' showArrow={true}>
              {azs.map(az => (
                <Select.Option value={az} key={az}>
                  {az}
                </Select.Option>
              ))}
            </AutoDisabledSelect>
          </Form.Item>
        )
      }
    }
  ]

  React.useEffect(() => {
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.COUNTRY_AZ]: form })
  }, [dispatchers, form, isEditing])

  const getInitialCountryAzsOptions = React.useCallback(async () => {
    const { items: cids } = await globalControllerGetCids()
    setCids(cids)
    if (env) {
      const { availableZones } = await deployConfigControllerListAvailableZones({
        tenantId,
        appName,
        projectName,
        env
      })
      const azs = availableZones.map(item => item.name)
      setAzs(azs)
    }
  }, [appName, env, projectName, tenantId])

  React.useEffect(() => {
    getInitialCountryAzsOptions()
  }, [getInitialCountryAzsOptions])

  const initializeFormValues = React.useCallback(() => {
    const idcsValues = idcs?.[env] || {}
    const formatIdcs = Object.entries(idcsValues).map(([cid, azs]: [string, string[]]) => {
      return {
        cid,
        azs
      }
    })
    form.setFieldsValue({
      idcs: {
        [env]: formatIdcs
      }
    })
    dispatchers.updateErrors(FORM_TYPE.COUNTRY_AZ)
    dispatchers.updateCountryAzsOptions(idcsValues)
  }, [dispatchers, env, form, idcs])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  const handleValuesChange = (_: unknown, allvalues: { idcs: Record<string, ICountryAZ[]> }) => {
    const { idcs } = allvalues
    const options = idcs?.[env]?.reduce((obj, item) => {
      if (item?.cid) {
        obj[item.cid] = item?.azs
      }
      return obj
    }, {})

    dispatchers.updateCountryAzsOptions(options)
  }

  return (
    <SectionWrapper
      title={FORM_TYPE.COUNTRY_AZ}
      anchorKey={FORM_TYPE.COUNTRY_AZ}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for more CID - AZ mapping info
        </>
      }
    >
      <Form
        form={form}
        layout='horizontal'
        requiredMark={false}
        onValuesChange={handleValuesChange}
        onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.COUNTRY_AZ)}
      >
        <RowFormField>
          <Form.List name={['idcs', env]}>
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                canDeleteAll={false}
                formType={FORM_TYPE.COUNTRY_AZ}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default CountryAZ

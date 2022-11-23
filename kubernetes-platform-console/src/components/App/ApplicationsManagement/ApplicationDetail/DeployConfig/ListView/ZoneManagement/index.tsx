import * as React from 'react'

import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import { Form, Select } from 'infrad'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { IDeployConfigZone, IListZoneResponse } from 'swagger-api/v1/models'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
import { find } from 'lodash'
import { StringParam, useQueryParam } from 'use-query-params'
import { buildGroupDetailRoute } from 'constants/routes/routes'
import { zoneControllerListAllZone } from 'swagger-api/v1/apis/Zone'
import {
  EditedSubTitle,
  SubTitle
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/ZoneManagement/style'

const ZoneManagement: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, countryAzsOptions, isEditing } = state
  const { deploy_zones } = newDeployConfig

  const application = useRecoilValue(selectedApplication)
  const { tenantId } = application
  const NOTICE_ADDRESS = `${location.origin}${buildGroupDetailRoute({ tenantId })}?selectedTab=zoneManagement`

  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)

  const [form] = Form.useForm()
  const [zoneOptions, setZoneOptions] = React.useState<Record<string, IListZoneResponse['zones']>>({})

  const handleCidChange = (index: number) => {
    const data = form.getFieldsValue()
    const { deploy_zones } = data
    if (deploy_zones) {
      deploy_zones[index].zone_name = ''
      deploy_zones[index].az = ''
      form.setFieldsValue({ deploy_zones: [...deploy_zones] })
    }
  }

  const handleAzChange = async (index: number, az: string) => {
    const { zones } = await zoneControllerListAllZone({ tenantId, az })
    setZoneOptions({ ...zoneOptions, [az]: zones })
    const data = form.getFieldsValue()
    const { deploy_zones } = data
    if (deploy_zones) {
      deploy_zones[index].zone_name = ''
      form.setFieldsValue({ deploy_zones: [...deploy_zones] })
    }
  }

  const columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect onChange={() => handleCidChange(name)}>
              {Object.keys(countryAzsOptions).map(
                cid =>
                  cid && (
                    <Select.Option value={cid} key={cid}>
                      {cid}
                    </Select.Option>
                  )
              )}
            </AutoDisabledSelect>
          </Form.Item>
        )
      }
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      key: 'az',
      width: '34%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.deploy_zones?.[name]?.cid !== curValue.deploy_zones?.[name]?.cid
            }
          >
            {({ getFieldValue }) => {
              const formValues = getFieldValue(['deploy_zones'])
              const cid = getFieldValue(['deploy_zones', name, 'cid'])
              const azs = countryAzsOptions?.[cid] || []

              return (
                <Form.Item
                  {...restField}
                  name={[name, 'az']}
                  rules={[{ required: true, message: 'Please fill in your target AZ(s)' }]}
                >
                  <AutoDisabledSelect onChange={(value: string) => handleAzChange(name, value)}>
                    {azs.map(az => (
                      <Select.Option value={az} key={az} disabled={!!find(formValues, { cid, az })}>
                        {az}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      }
    },
    {
      title: 'Zone',
      dataIndex: 'zone_name',
      key: 'zone_name',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.deploy_zones?.[name]?.az !== curValue.deploy_zones?.[name]?.az ||
              prevValue.deploy_zones?.[name]?.cid !== curValue.deploy_zones?.[name]?.cid
            }
          >
            {({ getFieldValue }) => {
              const az: string = getFieldValue(['deploy_zones', name, 'az'])
              const zones = zoneOptions?.[az]?.filter(zone => az === zone.az)
              return (
                <Form.Item
                  {...restField}
                  name={[name, 'zone_name']}
                  rules={[{ required: true, message: 'Please fill in your target zone(s)' }]}
                >
                  <AutoDisabledSelect>
                    {zones?.map(zone => (
                      <Select.Option value={zone.zoneName} key={zone.zoneName}>
                        {zone.zoneName}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      }
    }
  ]

  const getZoneList = React.useCallback(
    async (az: string) => {
      if (selectedEnv) {
        const { zones } = await zoneControllerListAllZone({ tenantId, az })
        setZoneOptions({ [az]: zones })
      }
    },
    [selectedEnv, tenantId]
  )

  React.useEffect(() => {
    deploy_zones?.forEach(async deployZone => {
      const { az } = deployZone
      getZoneList(az)
    })
    form.setFieldsValue({ deploy_zones })
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.ZONE_MANAGEMENT]: form })
    dispatchers.updateErrors(FORM_TYPE.ZONE_MANAGEMENT)
  }, [deploy_zones, dispatchers, form, getZoneList])

  React.useEffect(() => {
    const zoneMananger = form
      .getFieldValue('deploy_zones')
      ?.filter((zone: IDeployConfigZone) => {
        return zone && Object.keys(countryAzsOptions).includes(zone.cid)
      })
      .map((zone: IDeployConfigZone) => {
        return countryAzsOptions[zone.cid].includes(zone.az)
          ? { ...zone }
          : { ...zone, az: undefined, zone_name: undefined }
      })
    form.setFieldsValue({
      deploy_zones: zoneMananger
    })
  }, [countryAzsOptions, form])

  const generateSubTitle = () => {
    if (isEditing) return <EditedSubTitle>(Optional)</EditedSubTitle>
    if (deploy_zones?.length) return null
    return <SubTitle>Not Configured</SubTitle>
  }
  return (
    <SectionWrapper
      title='Zone Management'
      tooltip='Share the same resources among different deployments.'
      subTitle={generateSubTitle()}
      anchorKey={FORM_TYPE.ZONE_MANAGEMENT}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for zone list
        </>
      }
    >
      <Form
        form={form}
        layout='horizontal'
        requiredMark={false}
        onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.ZONE_MANAGEMENT)}
      >
        <RowFormField>
          <Form.List name='deploy_zones'>
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                addButtonText='Add'
                formType={FORM_TYPE.ZONE_MANAGEMENT}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default ZoneManagement

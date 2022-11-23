import * as React from 'react'

import { useParams } from 'react-router-dom'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import { Form, Select } from 'infrad'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { find } from 'lodash'
import { EditedSubTitle, SubTitle } from 'src/components/DeployConfig/ListView/ZoneManagement/style'
import { fetch } from 'src/rapper'
import { IModels } from 'src/rapper/request'

type IDeployConfigZone =
  IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']['deploy_zones'][0]
type IListZoneResponse = IModels['GET/api/ecp-cmdb/services/{serviceName}/zones']['Res']
const ZoneManagement: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, countryAzsOptions, isEditing, env } = state
  const { deploy_zones } = newDeployConfig

  const { serviceName } = useParams<{ serviceName: string }>()

  const tenantId = 1004
  // TODO: Jerry replace this after Space injecting zone management
  const NOTICE_ADDRESS = `https://kubernetes.devops.i.sz.shopee.io/applications/tenants/${tenantId}?selectedTab=zoneManagement`

  const [form] = Form.useForm()
  const [zoneOptions, setZoneOptions] = React.useState<Record<string, IListZoneResponse['zones']>>(
    {},
  )

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
    const { zones } = await fetch['GET/api/ecp-cmdb/services/{serviceName}/zones']({ serviceName })
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
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect onChange={() => handleCidChange(name)}>
              {Object.keys(countryAzsOptions).map(
                (cid) =>
                  cid && (
                    <Select.Option value={cid} key={cid}>
                      {cid}
                    </Select.Option>
                  ),
              )}
            </AutoDisabledSelect>
          </Form.Item>
        )
      },
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      key: 'az',
      width: '34%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

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
                    {azs.map((az) => (
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
      },
    },
    {
      title: 'Zone',
      dataIndex: 'zone_name',
      key: 'zone_name',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.deploy_zones?.[name]?.az !== curValue.deploy_zones?.[name]?.az ||
              prevValue.deploy_zones?.[name]?.cid !== curValue.deploy_zones?.[name]?.cid
            }
          >
            {({ getFieldValue }) => {
              const az: string = getFieldValue(['deploy_zones', name, 'az'])
              const zones = zoneOptions?.[az]?.filter((zone) => az === zone.az)
              return (
                <Form.Item
                  {...restField}
                  name={[name, 'zone_name']}
                  rules={[{ required: true, message: 'Please fill in your target zone(s)' }]}
                >
                  <AutoDisabledSelect>
                    {zones?.map((zone) => (
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
      },
    },
  ]

  const getZoneList = React.useCallback(
    async (az: string) => {
      if (env) {
        const { zones } = await fetch['GET/api/ecp-cmdb/services/{serviceName}/zones']({
          serviceName,
        })
        setZoneOptions({ [az]: zones })
      }
    },
    [env, serviceName],
  )

  React.useEffect(() => {
    deploy_zones?.forEach((deployZone) => {
      const { az } = deployZone
      void getZoneList(az)
    })
    form.setFieldsValue({ deploy_zones })
    dispatchers.updateDeployConfigForms({ [FormType.ZONE_MANAGEMENT]: form })
    dispatchers.updateErrors(FormType.ZONE_MANAGEMENT)
  }, [deploy_zones, dispatchers, form, getZoneList])

  React.useEffect(() => {
    const zoneMananger = form
      .getFieldValue('deploy_zones')
      ?.filter(
        (zone: IDeployConfigZone) => zone && Object.keys(countryAzsOptions).includes(zone.cid),
      )
      .map((zone: IDeployConfigZone) =>
        countryAzsOptions[zone.cid].includes(zone.az)
          ? { ...zone }
          : { ...zone, az: undefined, zone_name: undefined },
      )
    form.setFieldsValue({
      deploy_zones: zoneMananger,
    })
  }, [countryAzsOptions, form])

  const generateSubTitle = () => {
    if (isEditing) return <EditedSubTitle>(Optional)</EditedSubTitle>
    if (deploy_zones?.length) return null
    return <SubTitle>Not Configured</SubTitle>
  }
  return (
    <SectionWrapper
      title="Zone Management"
      tooltip="Share the same resources among different deployments."
      subTitle={generateSubTitle()}
      anchorKey={FormType.ZONE_MANAGEMENT}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for zone list
        </>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        requiredMark={false}
        onFieldsChange={() => dispatchers.updateErrors(FormType.ZONE_MANAGEMENT)}
      >
        <RowFormField>
          <Form.List name="deploy_zones">
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                addButtonText="Add"
                formType={FormType.ZONE_MANAGEMENT}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default ZoneManagement

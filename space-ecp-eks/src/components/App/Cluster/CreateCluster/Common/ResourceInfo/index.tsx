import React, { useCallback, useEffect, useState } from 'react'
import { Form, Card, Row, Col, Select, Cascader } from 'infrad'
import {
  FORM_WRAPPER_ID,
  RESOURCE_INFO_ITEM_NAME,
} from 'src/components/App/Cluster/CreateCluster/constant'
import InfoTooltip from 'src/components/Common/InfoTooltip'
import { useRequest } from 'ahooks'
import {
  eksEnumsController_listAllAzSegment,
  eksEnumsController_listAllEnvs,
  eksEnumsController_listAllTemplates,
  eksEnumsController_listAllSpaceTenants,
  eksEnumsController_listAllSpaceTenantProducts,
} from 'src/swagger-api/apis/EksEnums'
import {
  buildNameIdValue,
  parseNameIdtValue,
} from 'src/components/App/Cluster/CreateCluster/helper'
import type { DefaultOptionType } from 'antd/es/cascader'

interface ICascaderOption {
  value: string
  label: string
  children?: ICascaderOption[]
  isLeaf?: boolean
  loading?: boolean
}

interface IResourceInfoItemsProps {
  disabled?: boolean
}

const ResourceInfo: React.FC<IResourceInfoItemsProps> = ({ disabled = false }) => {
  const { data: azSegmentResponse } = useRequest(eksEnumsController_listAllAzSegment)
  const { data: envResponse } = useRequest(eksEnumsController_listAllEnvs)
  const { data: templatesResponse } = useRequest(eksEnumsController_listAllTemplates)
  const [serviceOptions, setServiceOptions] = useState<ICascaderOption[]>([])

  const azSegmentOptions: ICascaderOption[] =
    azSegmentResponse?.items
      .sort((pre, cur) => (pre?.azName > cur?.azName ? 1 : -1))
      .map(({ azKey, azName, segments }) => {
        const children = segments.map(({ segmentKey, segmentName }) => ({
          value: buildNameIdValue(segmentName, segmentKey),
          label: segmentName,
        }))
        const option = { value: buildNameIdValue(azKey, azName), label: azName, children }
        return option
      }) || []
  const getServiceOptionsFn = useCallback(async () => {
    const tenantsResponse = await eksEnumsController_listAllSpaceTenants()
    const tenantOptions: ICascaderOption[] = tenantsResponse?.items.sort().map((tenant) => ({
      value: tenant,
      label: tenant,
      isLeaf: false,
    }))
    setServiceOptions(tenantOptions)
  }, [])
  useEffect(() => {
    void getServiceOptionsFn()
  }, [getServiceOptionsFn])

  const handleLoadData = async (selectedOptions: ICascaderOption[]) => {
    // The Cascader has 2 level, and the 2nd level data is fetched by the 1nd level data
    if (selectedOptions.length !== 1) return
    const selectedTeamOption = selectedOptions[0]
    selectedTeamOption.loading = true
    const tenantName = selectedTeamOption.value
    const currentProducts = await eksEnumsController_listAllSpaceTenantProducts({
      tenantName,
    })
    selectedTeamOption.loading = false
    const productOptions = currentProducts.items.map(({ productName, productId }) => ({
      label: productName,
      value: buildNameIdValue(productName, productId),
    }))
    selectedTeamOption.children = productOptions
    setServiceOptions([...serviceOptions])
  }

  const azSegmentFilter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        typeof option.label === 'string' &&
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    )

  return (
    <Card title="Resource Info">
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item
            label="AZ/Segment"
            name={RESOURCE_INFO_ITEM_NAME.AZ_SEGMENT}
            rules={[{ required: true }]}
          >
            <Cascader
              options={azSegmentOptions}
              disabled={disabled}
              dropdownMenuColumnStyle={{ maxWidth: 500 }}
              showSearch={{ filter: azSegmentFilter }}
              displayRender={(azSegment) => {
                const [azValue, segmentValue] = azSegment
                const { name: azName } = parseNameIdtValue(azValue)
                const { name: segmentName } = parseNameIdtValue(segmentValue)
                return `${azName}[${segmentName}]`
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Env" name={RESOURCE_INFO_ITEM_NAME.ENV} rules={[{ required: true }]}>
            <Select disabled={disabled}>
              {envResponse?.items.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Template"
            name={RESOURCE_INFO_ITEM_NAME.TEMPLATE}
            rules={[{ required: true }]}
          >
            <Select disabled={disabled}>
              {templatesResponse?.items.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label={
          <span>
            Service Name
            <InfoTooltip
              info="The service name will affect resource settlement and permission, please select your own team."
              getPopupContainer={() => document.getElementById(FORM_WRAPPER_ID)}
            />
          </span>
        }
        name={RESOURCE_INFO_ITEM_NAME.SERVICE}
        rules={[{ required: true, message: 'Please enter Service Name' }]}
      >
        <Cascader
          disabled={disabled}
          options={serviceOptions}
          displayRender={(service) => {
            const [tenantName, productValue] = service
            const { name: productName } = parseNameIdtValue(productValue)
            return `${tenantName} / ${productName}`
          }}
          loadData={handleLoadData}
        />
      </Form.Item>
    </Card>
  )
}

export default ResourceInfo

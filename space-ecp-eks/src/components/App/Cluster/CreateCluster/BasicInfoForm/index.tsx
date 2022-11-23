import React, { useEffect, useState } from 'react'
import { Form, FormInstance, Space } from 'infrad'
import { FormProps } from 'infrad/lib/form'
import ResourceInfo from 'src/components/App/Cluster/CreateCluster/Common/ResourceInfo'
import { IBasicInfoForm } from 'src/components/App/Cluster/CreateCluster/constant'
import ClusterSpec from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/ClusterSpec'
import Etcd from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/ETCD'
import NetworkingModel from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/NetworkingModel'
import ClusterNetwork from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/ClusterNetwork'
import Advance from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/Advance'
import { useRequest } from 'ahooks'
import { eksClusterController_getAnchorServer } from 'src/swagger-api/apis/EksCluster'
import {
  eksEnumsController_listAllVpcs,
  eksEnumsController_listAllPlatforms,
  eksEnumsController_listAllKubernetesVersions,
} from 'src/swagger-api/apis/EksEnums'
import { IVpc } from 'src/swagger-api/models'
import { HTTPError } from '@space/common-http'
import { message } from 'antd'
import { parseNameIdtValue } from 'src/components/App/Cluster/CreateCluster/helper'

interface IBasicInfoFormProps {
  form: FormInstance<IBasicInfoForm>
  initialValues: IBasicInfoForm
  onValuesChange?: FormProps['onValuesChange']
}

const BasicInfoForm: React.FC<IBasicInfoFormProps> = ({ form, initialValues, onValuesChange }) => {
  // update initialValues when previous form value changes
  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  const { resourceInfo } = initialValues || {}
  const { env: selectedEnv, azSegment = [] } = resourceInfo || {}
  const az = azSegment[0]
  const { name: selectedAz } = parseNameIdtValue(az)
  const getDefaultAnchorServerFn = () =>
    eksClusterController_getAnchorServer({ env: selectedEnv, az: selectedAz })

  const { data: anchorServerResponse } = useRequest(getDefaultAnchorServerFn)
  const { data: platformResponse } = useRequest(eksEnumsController_listAllPlatforms)
  const { data: k8sVersionResponse } = useRequest(eksEnumsController_listAllKubernetesVersions)

  const [vpcs, setVpcs] = useState<IVpc[]>([])
  useEffect(() => {
    // update form value if initialValues change
    anchorServerResponse?.address &&
      form.setFieldsValue({
        ...initialValues,
        networkingModel: { anchorServer: anchorServerResponse?.address },
      })
  }, [anchorServerResponse?.address, form, initialValues])

  const [vpcsLoading, setVpcsLoading] = useState(false)

  const getVpcsFn = async () => {
    const formValues = form.getFieldsValue()
    const platformValue = formValues?.clusterSpec?.platform
    const { name: platformName } = parseNameIdtValue(platformValue)
    const platformItem = platformResponse?.items.find(({ name }) => name === platformName)
    setVpcsLoading(true)
    try {
      const vpcsResponse = await eksEnumsController_listAllVpcs({
        az: selectedAz,
        platformID: platformItem?.id,
      })
      setVpcs(vpcsResponse?.items)
    } catch (error) {
      if (error instanceof HTTPError) {
        message.error(error?.message)
      }
    }
    setVpcsLoading(false)
  }

  const handleFormChange: FormProps['onValuesChange'] = (changedValues, values) => {
    onValuesChange(changedValues, values)
    const platformName = changedValues?.clusterSpec?.platform
    if (platformName) {
      void getVpcsFn()
    }
  }

  const vpcEnabledInitialValue = initialValues?.networkingModel?.enableVpcCNI
  const [vpcEnabled, setVpcEnabled] = useState<boolean>(vpcEnabledInitialValue)

  return (
    <Form
      layout="vertical"
      name="basicInfo"
      onValuesChange={handleFormChange}
      form={form}
      initialValues={initialValues}
    >
      <Space direction="vertical" size={16} style={{ width: '100%', verticalAlign: 'top' }}>
        <ResourceInfo disabled />
        <ClusterSpec
          platforms={platformResponse?.items}
          kuernetesVersions={k8sVersionResponse?.items}
        />
        <Etcd />
        <NetworkingModel
          enableVpcCNI={vpcEnabled}
          vpcs={vpcs}
          refreshVpcsFn={() => getVpcsFn()}
          vpcsLoading={vpcsLoading}
          onEnableVpcCNIChange={(enabled) => setVpcEnabled(enabled)}
        />
        <ClusterNetwork vpcEnabled={vpcEnabled} />
        <Advance form={form} />
      </Space>
    </Form>
  )
}

export default BasicInfoForm

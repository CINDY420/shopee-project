import React from 'react'
import DetailLayout from 'components/Common/DetailLayout'
import { Root } from 'components/App/ClusterManagement/ClusterDetail/style'
import Content from 'components/App/ClusterManagement/ClusterDetail/Content'
import Head from 'components/App/ClusterManagement/ClusterDetail/Head'
import { FormOutlined } from 'infra-design-icons'
import { useRecoilValue } from 'recoil'
import { selectedCluster } from 'states'
import CrudModal from 'components/Common/CrudModal'
import { useForm } from 'infrad/lib/form/Form'
import EditClusterModal from 'components/App/ClusterManagement/ClusterDetail/EditClusterModal'
import { tenantControllerUpdateTenants } from 'swagger-api/apis/Tenant'
import { IOpenApiQuota, IUpdateTenantsPayload } from 'swagger-api/models'
import { message } from 'infrad'
import Breadcrumb, { CRUMB_TYPE } from 'components/App/ClusterManagement/Common/BreadCrumb'

export interface IUpdateTenantEnvQuotas {
  checked: boolean
  env: string
  quota: IOpenApiQuota
}
export interface IFormData {
  envs: string[]
  tenants: string[]
  tenantsIdAndNameMap: Record<string, string>
  quotas: { [key: string]: IUpdateTenantEnvQuotas[] }
}
const ClusterDetail = () => {
  const { displayName: clusterName, clusterId } = useRecoilValue(selectedCluster)
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false)
  const [isEditClusterModalVisible, setIsEditClusterModalVisible] = React.useState<boolean>(false)
  const [form] = useForm<IFormData>()

  const handleEditButtonClick = () => {
    setIsEditClusterModalVisible(true)
  }

  const generateUpdatePayload = (formData: IFormData) => {
    const { tenants, quotas, tenantsIdAndNameMap } = formData
    const updateTenantsQuota: IUpdateTenantsPayload = {}
    tenants.forEach((tenantId) => {
      const updateTenantEnvQuotas: IUpdateTenantEnvQuotas[] = quotas[tenantId]
      const envQuotas = updateTenantEnvQuotas
        .filter((envQuota) => envQuota.checked)
        .map((envQuota) => {
          const { env, quota } = envQuota
          const clusterQuota = [
            {
              clusterId,
              quota: { ...quota, memory: `${quota.memory}Gi` },
            },
          ]
          return {
            env,
            clusterQuota,
          }
        })
      updateTenantsQuota[tenantId] = { tenantCmdbName: tenantsIdAndNameMap[tenantId], envQuotas }
    })
    return updateTenantsQuota
  }

  const handleModalSubmit = async () => {
    setIsSubmitLoading(true)
    const value = await form.validateFields()
    const updateTenantsQuota = generateUpdatePayload(value)
    try {
      const result = await tenantControllerUpdateTenants({ payload: updateTenantsQuota })
      if (result.failed.length > 0) {
        message.warning(`${result.failed.join(', ')}update failed`)
      } else {
        message.success('Update successfully')
      }
      setIsSubmitLoading(false)
      setIsEditClusterModalVisible(false)
    } catch (error) {
      console.error('error handleModalSubmit:', error)
      setIsSubmitLoading(false)
      message.error(error?.message || 'Update failed')
    }
  }

  const handleModalCancel = () => {
    setIsSubmitLoading(false)
    setIsEditClusterModalVisible(false)
    form.resetFields()
  }

  return (
    <DetailLayout
      title="Cluster: "
      resource={clusterName}
      buttons={[
        {
          icon: <FormOutlined />,
          text: 'Edit',
          onClick: () => {
            handleEditButtonClick()
          },
        },
      ]}
      body={
        <Root>
          <Head />
          <Content />
          <CrudModal
            visible={isEditClusterModalVisible}
            title="Edit Cluster"
            width={1024}
            isSubmitLoading={isSubmitLoading}
            onOk={handleModalSubmit}
            onCancel={handleModalCancel}
            destroyOnClose
          >
            <EditClusterModal form={form} clusterId={clusterId} />
          </CrudModal>
        </Root>
      }
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs
      breadcrumbs={<Breadcrumb crumbName={CRUMB_TYPE.CLUSTER} />}
    />
  )
}

export default ClusterDetail

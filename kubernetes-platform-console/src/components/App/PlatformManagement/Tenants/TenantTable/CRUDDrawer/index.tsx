import * as React from 'react'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'
import TenantForm from './TenantForm'

import { groupsControllerCreateTenant, groupsControllerUpdateTenant } from 'swagger-api/v3/apis/Tenants'
import { ITenant } from 'api/types/tenant/tenant'

import { StyledTitle } from './style'

interface ICRUDUserDrawer {
  visible: boolean
  selectedTenant: ITenant
  onHideDrawer: () => void
  onRefresh: () => void
}

const CRUDDrawer: React.FC<ICRUDUserDrawer> = ({ visible, selectedTenant, onHideDrawer, onRefresh }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState<boolean>(false)

  // const [envsList, setEnvsList] = React.useState<string[]>([])
  // const [cidsList, setCIDsList] = React.useState<string[]>([])
  // const [clustersList, setClustersList] = React.useState<string[]>([])

  // const fetchSelectList = async () => {
  //   const tenantConfig = await getTenantConfig()
  //   const { envs, cids, clusters } = tenantConfig
  //   setEnvsList(envs)
  //   setCIDsList(cids)
  //   setClustersList(clusters)
  // }

  // React.useEffect(() => {
  //   fetchSelectList()
  // }, [])

  const handleSubmit = async () => {
    setLoading(true)
    const { id } = selectedTenant || {}
    try {
      const values: any = await form.validateFields()
      !id
        ? await groupsControllerCreateTenant({ payload: values })
        : await groupsControllerUpdateTenant({ tenantId: id, payload: values })
      onHideDrawer()
      onRefresh()
      message.success(`${!id ? 'Add' : 'Update'} tenant successfully!`)
      form.resetFields()
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={false}
      title={<StyledTitle>{Object.keys(selectedTenant).length ? 'Edit Tenant' : 'Add Tenant'}</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={onHideDrawer}
      body={<TenantForm form={form} selectedTenant={selectedTenant} />}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}

export default CRUDDrawer

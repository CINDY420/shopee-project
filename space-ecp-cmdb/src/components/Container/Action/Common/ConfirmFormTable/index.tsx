import React from 'react'
import { Table } from 'src/common-styles/table'
import { SuspendEditForm, StopEditForm } from 'src/components/Container/Action'
import { columns, Deployment } from 'src/components/Container/Action/Common/EditFormTable'
interface IConfirmFormTableProps {
  editFormData: SuspendEditForm | StopEditForm
  deployments: Deployment[]
}

const ConfirmFormTable: React.FC<IConfirmFormTableProps> = (props) => {
  const { editFormData, deployments } = props

  const checkedDeployments = deployments.filter((deployment) => {
    const { deployId } = deployment
    return editFormData?.includes(deployId)
  })

  return (
    <Table
      rowKey="deployId"
      columns={columns}
      dataSource={checkedDeployments}
      pagination={false}
      bordered
    />
  )
}

export default ConfirmFormTable

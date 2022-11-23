import { ADMIN_ID_LIST } from 'constants/auth'
import { BATCH_ACTIONS } from 'constants/job'
import { hasRole } from 'helpers/permission'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { Menu, MenuProps, message, Modal } from 'infrad'
import { useRecoilValue } from 'recoil'
import { globalAuthState } from 'states'
import { jobControllerBatchDeleteJob } from 'swagger-api/apis/Job'

type IHandleOverlayClick = NonNullable<MenuProps['onClick']>
interface IJobListBatchActionsMenuProps {
  tenantId?: string
  projectId?: string
  setTitle: (title: string) => void
  selectedJobs: string[]
  onBatchActionSuccess: () => void
}
const JobListBatchActionsMenu: React.FC<IJobListBatchActionsMenuProps> = ({
  tenantId,
  projectId,
  setTitle,
  selectedJobs,
  onBatchActionSuccess,
}) => {
  const { roles } = useRecoilValue(globalAuthState)
  const handleDelteAllJobs = () => {
    Modal.confirm({
      title: 'Delete All',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to delete all jobs? The operation is not reversible!',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          await jobControllerBatchDeleteJob({
            tenantId,
            projectId,
            payload: {
              deleteAll: true,
              jobIds: [],
            },
          })
          message.success('Delete all jobs successfully')
          onBatchActionSuccess()
        }
      },
    })
  }
  const handleOverlayClick: IHandleOverlayClick = ({ key }) => {
    if (key === BATCH_ACTIONS.DELETE_ALL) {
      return handleDelteAllJobs()
    }
    setTitle(key)
  }
  return (
    <Menu onClick={handleOverlayClick}>
      <Menu.Item key={BATCH_ACTIONS.BATCH_DELETE_JOB} disabled={selectedJobs.length === 0}>
        {BATCH_ACTIONS.BATCH_DELETE_JOB}
      </Menu.Item>
      <Menu.Item key={BATCH_ACTIONS.BATCH_KILL_JOB} disabled={selectedJobs.length === 0}>
        {BATCH_ACTIONS.BATCH_KILL_JOB}
      </Menu.Item>
      {ADMIN_ID_LIST.some((roleKey) => hasRole(roles, roleKey)) && (
        <Menu.Item key={BATCH_ACTIONS.DELETE_ALL}>{BATCH_ACTIONS.DELETE_ALL}</Menu.Item>
      )}
    </Menu>
  )
}

export default JobListBatchActionsMenu

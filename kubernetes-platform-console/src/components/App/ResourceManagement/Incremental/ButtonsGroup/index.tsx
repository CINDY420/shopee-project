import AddNewEstimatedModal from 'components/App/ResourceManagement/Incremental/AddNewEstimated'
import { Buttons, StyledButton } from 'components/App/ResourceManagement/Incremental/ButtonsGroup/style'
import VersionManagementModal from 'components/App/ResourceManagement/Incremental/VersionManagementModal'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { GlobalContext } from 'hocs/useGlobalContext'
import { AccessControlContext } from 'hooks/useAccessControl'
import { SettingOutlined } from 'infra-design-icons'
import { PaginationProps } from 'infrad'
import * as React from 'react'

interface IButtonsGroupProps {
  isBatchOperating: boolean
  refresh: (fromBeginning?: boolean, targetPagination?: PaginationProps) => void
}

const ButtonsGroup: React.FC<IButtonsGroupProps> = ({ isBatchOperating, refresh }) => {
  const [isVersionManagementModalVisible, setVersionManagementModalVisible] = React.useState(false)
  const [isAddNewEstimatedModalVisible, setAddNewEstimatedModalVisible] = React.useState(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const opsPermissions = accessControlContext[RESOURCE_TYPE.OPS] || []
  const canAddNewEstimates = opsPermissions.includes(RESOURCE_ACTION.AddNewEstimates)

  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  return (
    <>
      <Buttons>
        {isPlatformAdmin && (
          <StyledButton
            icon={<SettingOutlined />}
            onClick={() => setVersionManagementModalVisible(true)}
            disabled={isBatchOperating}
          >
            Version Management
          </StyledButton>
        )}
        <StyledButton
          onClick={() => setAddNewEstimatedModalVisible(true)}
          disabled={isBatchOperating || !canAddNewEstimates}
        >
          Add New Estimated
        </StyledButton>
      </Buttons>
      <VersionManagementModal
        isVisible={isVersionManagementModalVisible}
        onCancel={() => setVersionManagementModalVisible(false)}
        onOk={() => setVersionManagementModalVisible(false)}
      />
      <AddNewEstimatedModal
        isVisible={isAddNewEstimatedModalVisible}
        onCancel={() => setAddNewEstimatedModalVisible(false)}
        onOk={() => setAddNewEstimatedModalVisible(false)}
        refresh={refresh}
      />
    </>
  )
}

export default ButtonsGroup

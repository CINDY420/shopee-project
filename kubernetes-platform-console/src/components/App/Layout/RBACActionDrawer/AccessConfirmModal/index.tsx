import React, { useState } from 'react'

import { Button } from 'infrad'
import {
  StyledModal,
  StyledCheckbox,
  StyledTitle,
  StyleContainer,
  StyledBox,
  StyledBoxTitle,
  StyledGroup,
  StyledDeleteGroup,
  StyledArrow
} from './style'

interface IRole {
  roleId: number
  roleName: string
  tenantId: number
  tenantName: string
}

interface IAccessConfirmModal {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  beforeRoles: IRole[]
  afterRoles: IRole[]
  deleteRoles: IRole[]
}

const AccessConfirmModal: React.FC<IAccessConfirmModal> = ({
  visible,
  onOk,
  onCancel,
  beforeRoles,
  afterRoles,
  deleteRoles
}) => {
  const [deleteCheck, setDeleteCheck] = useState<boolean>(false)

  return (
    <StyledModal
      visible={visible}
      title='Notice'
      getContainer={() => document.body}
      onOk={onOk}
      onCancel={onCancel}
      centered={true}
      footer={[
        <StyledCheckbox
          checked={deleteCheck}
          onChange={e => setDeleteCheck(e.target.checked)}
          display={deleteRoles.length > 0}
          key='checkbox'
        >
          You will leave the permission group you deleted immediately.
        </StyledCheckbox>,
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='confirm' type='primary' onClick={onOk} disabled={deleteRoles.length > 0 && !deleteCheck}>
          Confirm
        </Button>
      ]}
    >
      <StyledTitle>Permission Group have change.</StyledTitle>
      <StyleContainer>
        <StyledBox>
          <StyledBoxTitle>Before</StyledBoxTitle>
          {beforeRoles.map(role => (
            <StyledGroup key={role.tenantId + '-' + role.roleId}>
              {role.tenantName}
              {role.tenantName ? '/' : ''}
              {role.roleName}
            </StyledGroup>
          ))}
        </StyledBox>
        <StyledArrow>→</StyledArrow>
        <StyledBox>
          <StyledBoxTitle>After</StyledBoxTitle>
          {afterRoles.map(role => (
            <StyledGroup key={role.tenantId + '-' + role.roleId}>
              {role.tenantName}
              {role.tenantName ? '/' : ''}
              {role.roleName}
            </StyledGroup>
          ))}
          {deleteRoles.map(role => (
            <StyledDeleteGroup key={role.tenantId + '-' + role.roleId}>
              {role.tenantName}
              {role.tenantName ? '/' : ''}
              {role.roleName}
            </StyledDeleteGroup>
          ))}
        </StyledBox>
      </StyleContainer>
    </StyledModal>
  )
}

export default AccessConfirmModal

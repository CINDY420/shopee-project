enum SamDefinedResponsePermissionProperty {
  USER_GROUPS_TO_APPLY = 'user_groups_to_apply',
  SUBSYSTEM_ADMINS_TO_APPLY = 'subsystem_admins_to_apply',
  POLICY_ADMINS_TO_APPLY = 'policy_admins_to_apply',
  PERMISSION_TO_APPLY = 'permission_to_apply',
  POLICY_GROUP_ADMINS_TO_APPLY = 'policy_group_admins_to_apply',
}

export interface IEcpApiForbiddenResponse {
  metadata: Record<SamDefinedResponsePermissionProperty, string>
}
export const hasMetadata = (data: any): data is IEcpApiForbiddenResponse => 'metadata' in data

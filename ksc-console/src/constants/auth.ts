export const CLUSTER_ADMIN_ID = '2101'
export const PLATFORM_ADMIN_ID = '2102'
export const TENANT_ADMIN_ID = '2103'
export const TENANT_MEMBER_ID = '2104'
export const PROJECT_ADMIN_ID = '2105'
export const PROJECT_MEMBER_ID = '2106'

// 2101(ksc-cluster-admin) and 2102(ksc-platform-admin) and 2103, 2104 are not allowed to apply for new users
export const GLOBAL_ROLE_ID_LIST = [
  CLUSTER_ADMIN_ID,
  PLATFORM_ADMIN_ID,
  TENANT_ADMIN_ID,
  TENANT_MEMBER_ID,
]
export const TENANT_ROLE_ID_LIST = [TENANT_ADMIN_ID, TENANT_MEMBER_ID]
export const PROJECT_ROLE_ID_LIST = [PROJECT_ADMIN_ID, PROJECT_MEMBER_ID]
export const TENANT_USER_MANAGEMENT_ROLE_ID_LIST = [TENANT_MEMBER_ID, PROJECT_ADMIN_ID]
export const PROJECT_USER_MANAGEMENT_ROLE_ID_LIST = [PROJECT_MEMBER_ID]
export const ADMIN_ID_LIST = [PLATFORM_ADMIN_ID]

export const TENANT_ROLE_LIST = [
  {
    text: 'ksc-tenant-admin',
    value: TENANT_ADMIN_ID,
  },
  {
    text: 'ksc-tenant-member',
    value: TENANT_MEMBER_ID,
  },
]

export const PROJECT_ROLE_LIST = [
  {
    text: 'ksc-project-admin',
    value: PROJECT_ADMIN_ID,
  },
  {
    text: 'ksc-project-member',
    value: PROJECT_MEMBER_ID,
  },
]

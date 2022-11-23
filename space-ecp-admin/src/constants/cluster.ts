export const platformClusterTypeMap: Record<string, string> = {
  az: 'cis',
  others: 'eks',
}

export enum STEP {
  ADD_TO_EKS_CLUSTER,
  ADD_TO_ECP_ADMIN,
  CONFIRM,
}

export const disableOAMDeployEcpVersions = ['leap']

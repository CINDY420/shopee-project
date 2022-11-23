export const GROUP = 'app.kubernetes.devops.i.sz.shopee.io'
export const VERSION = 'v1'
export const NAMESPACE = 'default'
export const NAMESPACE_PREFIX = 'plat-'
export const PATCH_HEADER = { headers: { 'content-type': 'application/merge-patch+json' } }

export const PROF_DESCRIPTOR_GROUP = 'pd.infra.shopee.io'
export const PROF_DESCRIPTOR_CRD_NAMESPACE = 'plat-prof-descriptor'
export const PROF_DESCRIPTOR_VERSION = 'v1beta1'
export const PROF_DESCRIPTOR_SUFFIX = 'prof-descriptor'

export const CLUSTER_CRD = {
  KIND: 'Cluster',
  PLURAL: 'clusters',
  SINGULAR: 'cluster'
}

export const APPLICATION_CRD = {
  KIND: 'Application',
  PLURAL: 'applications',
  SINGULAR: 'application'
}

export const PROJECT_CRD = {
  KIND: 'Project',
  PLURAL: 'projects',
  SINGULAR: 'project'
}

export const TENANT_QUOTA_CRD = {
  KIND: 'TenantQuota',
  PLURAL: 'tenantquota',
  SINGULAR: 'tenantquota'
}

export const APPLICATION_INSTANCE_CRD = {
  KIND: 'ApplicationInstance',
  PLURAL: 'applicationinstances',
  SINGULAR: 'applicationinstance'
}

export const APPLICATION_INSTANCE_OAM_CRD = {
  KIND: 'ApplicationInstanceOam',
  PLURAL: 'applicationinstanceoams',
  SINGULAR: 'applicationInstanceoam'
}

export const PROF_DESCRIPTOR_CRD = {
  KIND: 'ProfDescriptor',
  PLURAL: 'profdescriptors',
  SINGULAR: 'profdescriptor'
}

import { SetMetadata } from '@nestjs/common'
import { AUDIT_RESOURCE_TYPE, AUDIT_RESOURCE_TYPE_KEY } from '@/common/constants/audit-resource-type'

export const AuditResourceType = (resourceType: AUDIT_RESOURCE_TYPE) =>
  SetMetadata(AUDIT_RESOURCE_TYPE_KEY, resourceType)

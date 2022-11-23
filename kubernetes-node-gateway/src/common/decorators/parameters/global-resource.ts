import { SetMetadata } from '@nestjs/common'
import { RBAC_GLOBAL_RESOURCE_ACTION_META_KEY, RESOURCE_TYPE, RESOURCE_ACTION } from '@/common/constants/rbac'

/**
 * set the meta data for global resource rbac check
 * @param resource global resource needed to be checked
 * @param verb global resource verb needed to be checked
 * @example
 * @GlobalResourceGuard({
 *  resource: RESOURCE_TYPE.POD,
 *  action: RESOURCE_ACTION.View
 * })
 * get() {
 *  // your code
 * }
 */
export const GlobalResource = ({ resource, action }: { resource: RESOURCE_TYPE; action: RESOURCE_ACTION }) =>
  SetMetadata(RBAC_GLOBAL_RESOURCE_ACTION_META_KEY, [resource, action])

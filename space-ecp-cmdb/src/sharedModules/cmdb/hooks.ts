import { loadSharedModules } from '@space/common-utils'

const sharedModules = await loadSharedModules([
  { scope: 'console', container: 'cmdb', module: 'cmdbHooks' },
])

const hooks = sharedModules.console.cmdb.cmdbHooks

export default hooks

import { loadSharedModules } from '@space/common-utils'

const sharedModules = await loadSharedModules([
  { scope: 'console', container: 'cmdb', module: 'cmdbConstants' },
])

const constants = sharedModules.console.cmdb.cmdbConstants

export default constants

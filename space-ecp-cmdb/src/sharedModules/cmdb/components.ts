import { loadSharedModules } from '@space/common-utils'

const sharedModules = await loadSharedModules([
  { scope: 'console', container: 'cmdb', module: 'cmdbComponents' },
])

const components = sharedModules.console.cmdb.cmdbComponents

export default components

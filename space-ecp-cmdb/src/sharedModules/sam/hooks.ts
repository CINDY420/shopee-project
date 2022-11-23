import { loadSharedModules } from '@space/common-utils'
import UtilitySamHooks from 'space_utility_sam/hooks'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'hooks' },
])
const hooks: typeof UtilitySamHooks = sharedModules.utility.sam.hooks
export default hooks

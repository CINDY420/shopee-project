import { loadSharedModules } from '@space/common-utils'
import UtilitySamUtils from 'space_utility_sam/utils'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'utils' },
])
const utils: typeof UtilitySamUtils = sharedModules.utility.sam.utils
export default utils

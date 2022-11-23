import { loadSharedModules } from '@space/common-utils'
import UtilitySamApis from 'space_utility_sam/apis'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'apis' },
])
const apis: typeof UtilitySamApis = sharedModules.utility.sam.apis
export default apis

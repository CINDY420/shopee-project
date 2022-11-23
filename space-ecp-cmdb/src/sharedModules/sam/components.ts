import { loadSharedModules } from '@space/common-utils'
import UtilitySamComponents from 'space_utility_sam/components'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'components' },
])
const components: typeof UtilitySamComponents = sharedModules.utility.sam.components
export default components

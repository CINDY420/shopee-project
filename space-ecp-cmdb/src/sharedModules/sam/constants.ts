import { loadSharedModules } from '@space/common-utils'
import UtilitySamConstants from 'space_utility_sam/constants'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'constants' },
])
const constants: typeof UtilitySamConstants = sharedModules.utility.sam.constants
export default constants

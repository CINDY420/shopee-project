import { SCOPE, CONTAINER } from './src/constants/config'
import run from '@space/runtime-entry'

run({
  appUrl: `/${SCOPE}/${CONTAINER}`,
  appname: 'ecp eks',
})

import { space } from '@space/core'
import { SCOPE, CONTAINER } from 'src/constants/config'
import App from 'src/components/App'
import { overrideRapper } from 'src/helpers/overrideRapper'

overrideRapper()

export default function (): { init: () => void } {
  return {
    init(): void {
      space.registerApp({
        scope: SCOPE,
        container: CONTAINER,
        App,
      })
    },
  }
}

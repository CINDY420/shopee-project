import { space } from '@space/core'
import { SCOPE, CONTAINER } from 'src/constants/config'
import GlobalEntry from 'src/generated/routes/GlobalEntry'
import { overrideRapper } from 'src/helpers/fetch'

overrideRapper()

export default function (): { init: () => void } {
  return {
    init(): void {
      space.registerApp({
        scope: SCOPE,
        container: CONTAINER,
        App: GlobalEntry,
      })
    },
  }
}

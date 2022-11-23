import { ResizableLFPanel } from '@space/common-components'
import { SCOPE, CONTAINER } from 'src/constants/config'

const RESIZE_KEY = `/${SCOPE}/${CONTAINER}`

/*
 * Powered by routergen.
 * See docs at https://git.garena.com/shopee/space/front-end/spaceman/space-routergen/-/blob/master/README.md
 */
export default function (): JSX.Element {
  return (
    <ResizableLFPanel
      left={<div>Your left navigation</div>}
      resizeKey={RESIZE_KEY}
      right={<div>Your main content</div>}
    />
  )
}

declare let __SERVER_ENV__: string
declare let __RELEASE__: string
declare let __IS_LOCAL__: boolean
declare let __RELEASE_FEATURES__: string[]
declare let __RELEASE_BUGFIXES__: string[]
declare let __IS_VITE__: boolean

/* eslint-disable-next-line @typescript-eslint/naming-convention */
interface HTMLElement {
  mozRequestFullScreen?: () => void
  webkitRequestFullscreen?: () => void
}
/* eslint-disable-next-line @typescript-eslint/naming-convention */
interface Document {
  mozCancelFullScreen?: () => void
  webkitExitFullscreen?: () => void
  mozFullScreenElement?: () => void
  webkitFullscreenElement?: () => void
}

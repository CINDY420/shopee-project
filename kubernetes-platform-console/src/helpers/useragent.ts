export const checkIsWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return !!/micromessenger/.test(ua)
}

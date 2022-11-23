const serverMap = {
  dev: 'kube-dev.devops.dev.sz.shopee.io',
  test: 'kube-test.devops.test.sz.shopee.io',
  live: 'kubernetes.devops.i.sz.shopee.io',
  staging: 'kubernetes.devops.i.staging.sz.shopee.io',
  'plat-test': 'kube-test-plat.devops.test.sz.shopee.io',
  'banking-test': 'opsnonlive-k8s.bke.shopee.io',
  'banking-live': 'ops-k8s.bke.shopee.io'
}

const socketAddress = __IS_LOCAL__ ? serverMap[__SERVER_ENV__] : location.hostname

export const localServer = `https://${serverMap[__SERVER_ENV__]}`
export const SOCKET = `wss://${socketAddress}`

// Google Single Login Settings
const shopeeHostOriginList = [serverMap.live, serverMap.staging, serverMap.dev, serverMap.test]
const isShopeeHost = shopeeHostOriginList.includes(location.hostname)
export const cookiePolicy = isShopeeHost ? 'https://shopee.io' : 'single_host_origin'

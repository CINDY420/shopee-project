export const envServerMap: Record<string, string> = {
  live: 'https://kubernetes.devops.i.sz.shopee.io',
  test: 'https://kube-test.devops.test.sz.shopee.io',
  dev: 'https://kube-test.devops.test.sz.shopee.io',
  local: 'http://localhost:3000',
  mock: 'https://rap.shopee.io/api/app/mock/211',
}

export const baseUrl = envServerMap[__SERVER_ENV__]

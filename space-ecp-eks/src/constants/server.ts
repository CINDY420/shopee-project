export const SERVER_MAP: Record<string, string> = {
  test: 'https://kube-test.devops.test.sz.shopee.io',
  local: 'http://localhost:3000',
  live: 'https://kubernetes.devops.i.sz.shopee.io',
}

export const RESPONSE_STATUS = {
  NO_PERMISSION: 403,
} as const

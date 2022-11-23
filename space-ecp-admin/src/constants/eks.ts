const EKS_SERVER: Record<string, string> = {
  live: 'https://space.shopee.io',
  test: 'https://space.test.shopee.io',
  local: 'https://space.test.shopee.io',
}

const EKS_BASE_URL = EKS_SERVER[__SERVER_ENV__]

export const buildEksClusterDetailUrl = (clusterId: number) =>
  `${EKS_BASE_URL}/ecp/eks/cluster/${clusterId}`

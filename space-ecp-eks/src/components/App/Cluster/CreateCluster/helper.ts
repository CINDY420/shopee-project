import {
  IServerForm,
  IBasicInfoForm,
  IClusterNetworkIPCidr,
} from 'src/components/App/Cluster/CreateCluster/constant'
import { IEKSCreateClusterBody } from 'src/swagger-api/models'

const IP_V4_REGEXP = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/

export const isValidIPV4 = (ip: string) => IP_V4_REGEXP.test(ip)
export const antdFormIPV4ListValidator = (ips: string[]) => {
  // Ignore empty input
  if (!ips) return Promise.resolve()
  // Check input ips
  const areInvalidIps = ips.some((ip) => !isValidIPV4(ip))
  if (areInvalidIps) return Promise.reject(new Error('Please enter correct IPs.'))
  return Promise.resolve()
}
export const isEmptyIpCidr = (ipCidr: IClusterNetworkIPCidr) => {
  const { firstDDN, secondDDN, thirdDDN, fourthDDN, cidr } = ipCidr || {}
  if (
    !ipCidr ||
    (typeof firstDDN !== 'number' &&
      typeof secondDDN !== 'number' &&
      typeof thirdDDN !== 'number' &&
      typeof fourthDDN !== 'number' &&
      typeof cidr !== 'number')
  ) {
    return true
  }
  return false
}
export const buildIPV4 = (ipCidr: IClusterNetworkIPCidr) => {
  const { firstDDN, secondDDN, thirdDDN, fourthDDN, cidr } = ipCidr || {}
  if (
    typeof firstDDN === 'number' &&
    typeof secondDDN === 'number' &&
    typeof thirdDDN === 'number' &&
    typeof fourthDDN === 'number' &&
    typeof cidr === 'number'
  ) {
    return `${firstDDN}.${secondDDN}.${thirdDDN}.${fourthDDN}`
  }
}
export const parseIPCidr = (
  ipCidr: string | undefined,
): IClusterNetworkIPCidr & { cidr: number } => {
  if (!ipCidr) return
  const serviceCidrItems = ipCidr.split('/')
  let service: string
  let firstDDN: string
  let secondDDN: string
  let thirdDDN: string
  let fourthDDN: string
  let cidr: string
  if (serviceCidrItems.length === 2) {
    service = serviceCidrItems[0]
    cidr = serviceCidrItems[1]
    const serviceItems = service.split('.')
    if (serviceItems.length === 4) {
      firstDDN = serviceItems[0]
      secondDDN = serviceItems[1]
      thirdDDN = serviceItems[2]
      fourthDDN = serviceItems[3]
    }
  }
  return {
    firstDDN: Number(firstDDN),
    secondDDN: Number(secondDDN),
    thirdDDN: Number(thirdDDN),
    fourthDDN: Number(fourthDDN),
    cidr: Number(cidr),
  }
}

const buildExtraArg = (key: string, value: string) => `${key}=${value}`
export const parseExtraArg = (arg: string) => {
  const argItems = arg.split('=')
  if (argItems.length === 2) {
    return { key: argItems[0], value: argItems[1] }
  }
}

export const buildNameIdValue = (name: string, id: number | string) => {
  if (!name || !id) return
  return `${name}===${id}`
}
export const parseNameIdtValue = (value: string) => {
  if (typeof value !== 'string') return {}
  const [name, id] = value.split('===')
  return { name, id }
}

// Transform Antd Form value to create cluster api body
export const formatFormValue = (formValue: IServerForm & IBasicInfoForm): IEKSCreateClusterBody => {
  const { resourceInfo, clusterNetwork, clusterSpec, advance, ...others } = formValue
  const { azSegment = [], ...otherResourceInfos } = resourceInfo
  if (azSegment.length !== 2) {
    console.error('Invalid form azSegment:', azSegment)
  }
  const [az, segment] = azSegment
  const { platform, ...otherClusterSpecs } = clusterSpec
  const { name: platformName, id: platformId } = parseNameIdtValue(platform)
  const formattedClusterSpec = {
    ...otherClusterSpecs,
    platformName,
    platformId: Number(platformId),
  }
  const { serviceCidrBlock, podCidrBlock, ...otherClusterNetworks } = clusterNetwork
  const serviceIp = buildIPV4(serviceCidrBlock)
  const servicesCidrBlocks =
    serviceIp && serviceCidrBlock.cidr && `${serviceIp}/${serviceCidrBlock.cidr}`
  const podIp = buildIPV4(podCidrBlock)
  const podCidrBlocks = podIp && podCidrBlock.cidr && `${podIp}/${podCidrBlock.cidr}`
  const {
    apiServerExtraArgs = [],
    controllerManagementExtraArgs = [],
    schedulerExtraArgs = [],
    ...otherAdvances
  } = advance
  const formattedApiServerExtraArgs = apiServerExtraArgs.map(({ key, value }) =>
    buildExtraArg(key, value),
  )
  const formattedControllerManagementExtraArgs = controllerManagementExtraArgs.map(
    ({ key, value }) => buildExtraArg(key, value),
  )
  const formattedSchedulerExtraArgs = schedulerExtraArgs.map(({ key, value }) =>
    buildExtraArg(key, value),
  )
  const { name: azName, id: azKey } = parseNameIdtValue(az)
  const { name: segmentName, id: segmentKey } = parseNameIdtValue(segment)

  const formattedBody = {
    resourceInfo: {
      azName,
      azKey,
      segmentName,
      segmentKey,
      ...otherResourceInfos,
    },
    clusterSpec: formattedClusterSpec,
    clusterNetwork: { servicesCidrBlocks, podCidrBlocks, ...otherClusterNetworks },
    advance: {
      apiServerExtraArgs: formattedApiServerExtraArgs,
      controllerManagementExtraArgs: formattedControllerManagementExtraArgs,
      schedulerExtraArgs: formattedSchedulerExtraArgs,
      ...otherAdvances,
    },
    ...others,
  }

  return formattedBody
}

import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'
import {
  EKSClusterSpec,
  EKSClusterETCD,
  EKSClusterNetworkingModel,
  EKSClusterNetwork,
  EKSClusterAdvance,
} from '@/modules/eks-cluster/dto/eks-cluster.dto'

class EksSegment {
  segmentKey: string
  segmentName: string
}

class EksAZ {
  azKey: string
  azName: string
  segments: EksSegment[]
}
export class EksListAllAzSegmentResponse {
  items: EksAZ[]
}

export class EksListAllEnvsResponse {
  items: string[]
}

class EksTemplate {
  id: number
  name: string
}
export class EksListAllTemplatesResponse {
  items: EksTemplate[]
}

export class EksGetTemplateDetailParam {
  @IsNumberString()
  templateId: string
}

export class EksGetTemplateDetailResponse {
  clusterSpec: EKSClusterSpec
  etcd: EKSClusterETCD
  networkingModel: EKSClusterNetworkingModel
  clusterNetwork: EKSClusterNetwork
  advance: EKSClusterAdvance
}

export class EksListAllSpaceTenantsResponse {
  items: string[]
}

class EksSpaceTenantProduct {
  productId: number
  productName: string
}
export class EksListAllSpaceTenantProductsResponse {
  items: EksSpaceTenantProduct[]
}
export class EksListAllSpaceTenantProductsParams {
  @IsString()
  @IsNotEmpty()
  tenantName: string
}

class EksPlatform {
  id: number
  name: string
}
export class EksListAllPlatformsResponse {
  items: EksPlatform[]
}

export class EksListAllKubernetesVersionsResponse {
  items: string[]
}

class Vpc {
  name: string
  isDefault: boolean
}
export class EksListAllVpcsResponse {
  items: Vpc[]
}
export class EksListAllVpcsQuery {
  @IsString()
  @IsNotEmpty()
  platformID: number

  @IsString()
  @IsNotEmpty()
  az: string
}

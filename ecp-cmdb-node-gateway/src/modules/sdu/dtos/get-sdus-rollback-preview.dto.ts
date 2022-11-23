import { IsNotEmpty, IsString } from 'class-validator'

export class GetSDUsRollbackPreviewQuery {
  @IsNotEmpty()
  @IsString()
  sdus: string

  @IsNotEmpty()
  @IsString()
  targetTag: string
}

export class DeploymentRollbackPreview {
  deployId: string
  az: string
  currentTag: string
  currentInstances: number
  targetTag: string
  targetInstances: number
}

class SDURollbackPreview {
  sdu: string
  previews: DeploymentRollbackPreview[]
}

export class GetSDUsRollbackPreviewResponse {
  items: SDURollbackPreview[]
  total: number
}

import { Version } from '@/features/sdu-resource/entities/version.entity'

export class ListVersionResponse {
  versions: Version[]
  total: number
}

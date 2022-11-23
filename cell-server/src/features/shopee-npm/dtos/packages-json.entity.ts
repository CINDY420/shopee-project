import { PackageJsonEntity } from '@/features/shopee-npm/dtos/package-json.entity'

class DistTags {
  latest: string
  beta: string
  alpha: string
}
class Time {
  modified: string
  created: string;
  [version: string]: string
}
export class PackagesJsonEntity {
  name: string
  versions: Record<string, PackageJsonEntity>
  time: Time
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'dist-tags': DistTags
  readme: string
}

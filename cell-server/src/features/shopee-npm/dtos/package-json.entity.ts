class PublishConfig {
  registry: string
  access: string
}
class Repository {
  type: string
  url: string
}
type DevDependencies = Record<string, string>
type PeerDependencies = Record<string, string>
type Resolutions = Record<string, string>
class Dist {
  integrity: string
  shasum: string
  tarball: string
}

export class PackageJsonEntity {
  name: string
  version: string
  main: string
  publishConfig: PublishConfig
  files: string[]
  repository: Repository
  devDependencies: DevDependencies
  peerDependencies: PeerDependencies
  resolutions: Resolutions
  readmeFilename: string
  description: string
  dist: Dist
  types?: string
  typings?: string
}

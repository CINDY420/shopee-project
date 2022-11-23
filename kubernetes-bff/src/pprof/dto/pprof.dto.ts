import { ApiProperty } from '@nestjs/swagger'

export const PROFILING_STATUS = {
  Succeeded: 'Succeeded',
  Running: 'Running',
  Failed: 'Failed'
}
export type PROFILING_TYPE = 'CPU' | 'Allocs' | 'Heap' | 'Goroutine' | 'Block' | 'Trace'
export const PROFILING_TYPE_LIST: PROFILING_TYPE[] = ['CPU', 'Allocs', 'Heap', 'Goroutine', 'Block', 'Trace']
export const CONVERT_PROFILING_TYPE = {
  CPU: 'profile',
  Allocs: 'allocs',
  Heap: 'heap',
  Goroutine: 'goroutine',
  Block: 'block',
  Trace: 'trace'
}

export class Pprof {
  @ApiProperty()
  profileId: string

  @ApiProperty()
  podName: string

  @ApiProperty()
  env: string

  @ApiProperty()
  operator: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty()
  createdTime: string

  @ApiProperty()
  simpleTime: number

  @ApiProperty()
  object: string

  @ApiProperty({ type: [String] })
  graphs: string[]

  @ApiProperty()
  profile: string

  @ApiProperty()
  message: string
}
export class CreatePprofRequest {
  @ApiProperty()
  env: string

  @ApiProperty()
  podName: string

  @ApiProperty()
  podIP: string

  @ApiProperty()
  port: number

  @ApiProperty()
  sampleTime: number

  @ApiProperty()
  object: string

  @ApiProperty()
  cluster: string

  @ApiProperty()
  namespace: string

  @ApiProperty()
  cpuLimist: number

  @ApiProperty()
  memoryLimit: number
}

export class CreatePprofResponse {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  @ApiProperty({ type: Pprof })
  data: Pprof
}

export class PprofCommonParams {
  @ApiProperty()
  tenantId: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  appName: string

  @ApiProperty()
  deployName: string
}

export class GetPprofListQuery {
  @ApiProperty()
  offset: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  filterBy: string

  @ApiProperty()
  orderBy?: string
}

export class GetProfParams extends PprofCommonParams {
  @ApiProperty()
  profileId: string
}

export class GetProfCronJobQuery {
  @ApiProperty()
  cluster: string
}

export class PprofListResponse {
  @ApiProperty({ type: [Pprof] })
  list: Pprof[]

  @ApiProperty()
  total: number

  @ApiProperty()
  size: number

  @ApiProperty()
  offset: number
}

export class GetPprofResponse {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  @ApiProperty({ type: Pprof })
  data: Pprof
}
export class GetPprofListResponse {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  @ApiProperty({ type: PprofListResponse })
  data: PprofListResponse
}

export class GetPprofObjectResponse {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  @ApiProperty({ type: [String] })
  data: string[]
}

export class CreatePprofCronjobRequest extends CreatePprofRequest {
  @ApiProperty()
  scheduler: string

  @ApiProperty()
  enable: boolean
}

export class CreatePprofCronjobResponse {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string
}

export class GetPprofCronjobData {
  @ApiProperty()
  env: string

  @ApiProperty()
  port: number

  @ApiProperty()
  sampleTime: number

  @ApiProperty()
  object: string

  @ApiProperty()
  cluster: string

  @ApiProperty()
  cpuLimit: number

  @ApiProperty()
  memoryLimit: number

  @ApiProperty()
  enable: boolean

  @ApiProperty()
  scheduler: string

  @ApiProperty()
  deployName: string
}

export class GetPprofCronjobResponse extends CreatePprofCronjobResponse {
  @ApiProperty()
  data: GetPprofCronjobData
}

export type CreatePprofDTO = CreatePprofRequest & PprofCommonParams

export interface IGetProfDescriptorsRequest {
  projectName: string
  appName: string
  deployName: string
  profileId?: string
}

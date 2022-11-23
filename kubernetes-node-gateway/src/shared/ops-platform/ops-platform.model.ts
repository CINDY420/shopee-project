export interface IOpsPlatformResponse<TData = unknown> {
  code: number
  message: string
  data: TData
}

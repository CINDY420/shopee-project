interface IObject {
  [key: string]: any
}

export interface ICaseType {
  url?: string
  description: string
  headers?: IObject
  params?: IObject
  payload?: IObject
  expectedStatusCode: number
  // shouldValidateResponseType = false by default
  shouldValidateResponseType?: any
}

export interface ITestCasesType {
  method: string
  expectedResponseType?: any
  p1: ICaseType[]
  p2?: ICaseType[]
  p3?: ICaseType[]
  p4?: ICaseType[]
  before?: (cypress: any) => void
  after?: (cypress: any) => void
}

export interface IResponse<T> {
  code: number
  message: string
  data?: T
}

export interface IPaginationResponse<T> {
  code: number
  message: string
  data: {
    total: number
    offset: number
    size: number
    list?: T[]
  }
}

export const RESPONSE_CODE = {
  SUCCESS: 0,
  FAIL: -1
}

export const success = <T>(data: T, message = 'success') => {
  const response: IResponse<T> = {
    code: RESPONSE_CODE.SUCCESS,
    message,
    data
  }
  return response
}

export const fail = (code: string, message = 'internal error') => {
  const response: IResponse<null> = {
    code: RESPONSE_CODE.FAIL,
    message: message
  }
  return response
}

export const pSuccess = <T>(data: T[], total: number, offset: number, size: number, message = 'success') => {
  const response: IPaginationResponse<T> = {
    code: RESPONSE_CODE.SUCCESS,
    message,
    data: {
      total,
      offset,
      size,
      list: data
    }
  }
  return response
}

export const pFail = (total: number, offset: number, size: number, message = 'success', code = RESPONSE_CODE.FAIL) => {
  const response: IPaginationResponse<null> = {
    code,
    message,
    data: {
      total,
      offset,
      size,
      list: []
    }
  }
  return response
}

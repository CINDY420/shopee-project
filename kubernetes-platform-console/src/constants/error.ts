const CREATE_ACTION = /^create/
const UPDATE_ACTION = /^update/

export const ERROR_MIDDLEWARE_BLACK_LIST = [CREATE_ACTION, UPDATE_ACTION]

export const ERROR_CODE = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
}
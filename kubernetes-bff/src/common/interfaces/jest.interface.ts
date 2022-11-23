import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'

export enum METHODS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
  // add more request method if needed
}

interface IParams {
  url: string
  method: METHODS
}

export type RequestFn = (params: IParams) => supertest.SuperTest<supertest.Test>

export interface IGlobal {
  app: INestApplication
  request: RequestFn
}

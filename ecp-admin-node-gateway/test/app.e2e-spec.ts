import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { bootstrapMainApp } from '../src/bootstrap'

describe('ExampleController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await bootstrapMainApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/example (GET)', () => {
    return request(app.getHttpServer())
      .get('/bff/api/example/hello')
      .expect(200)
      .expect('{"data":"hello","code":0,"message":"OK","status":200}')
  })
})

import { Test } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { applicationBootstrap } from 'bootstrap'
import { RequestFn } from 'common/interfaces/jest.interface'
import K8sManager from './K8sManager'
import { env } from 'test/constants'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeEnvironment = require('jest-environment-node')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest')

class NestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    await super.setup()

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    const app = moduleFixture.createNestApplication()

    await applicationBootstrap(app, true)
    await app.init()

    this.global.app = app
    const request: RequestFn = ({ method, url }) => {
      return supertest(app.getHttpServer())
        [method](url)
        .set(
          'Cookie',
          'skesession=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaHVhZG9uZy5jaGVuIiwiZW1haWwiOiJodWFkb25nLmNoZW5Ac2hvcGVlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vbGg1Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tb1J3RkRwbHdKeEkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbXRReDQ3QVZCNkF4U19kS0ZHT3ZLTGtfcEhKdy9zOTYtYy9waG90by5qcGciLCJyb2xlIjoiRkUiLCJwb3NpdGlvbiI6Ik1hbmFnZXIiLCJpc1doaXRlIjp0cnVlLCJpc1FBIjpmYWxzZSwiaXNBTWFuYWdlciI6ZmFsc2UsImlzSW5mcmEiOnRydWUsImlzTWFuYWdlciI6dHJ1ZSwiZGVwYXJ0bWVudCI6W3sibmFtZSI6Ikt1YmVybmV0ZXMifSx7Im5hbWUiOiJCRSJ9LHsibmFtZSI6IkluZnJhc3RydWN0dXJlIFRlYW0ifSx7Im5hbWUiOiJEZXZlbG9wZXIgQ2VudGVyIn0seyJuYW1lIjoiU2hvcGVlIn0seyJuYW1lIjoiIn1dLCJkZXBhcnRQYXRoIjoiL1Nob3BlZS9EZXZlbG9wZXIgQ2VudGVyL0luZnJhc3RydWN0dXJlIFRlYW0vQkUvS3ViZXJuZXRlcyIsImdyb3VwIjoiSW5mcmFzdHJ1Y3R1cmUgVGVhbSIsImdyb3VwTGVhZGVycyI6W10sImVudiI6ImxvY2FsIiwiaWF0IjoxNjEwNjg4MDEzLCJleHAiOjM0NzQ2ODgwMTN9.feucshLLci1tqlBTaHqTj0CZ8VSTnlzlHK2rL9bQRGs'
        )
    }
    this.global.request = request
    this.global.env = env
    this.global.k8sManager = new K8sManager(this.global)
  }

  async teardown() {
    await this.global.app.close()
    this.global.app = null
    this.global.request = null
    this.global.env = null
    this.global.k8sManager = null
  }
}

module.exports = NestEnvironment

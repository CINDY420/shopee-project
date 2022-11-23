import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { UsersService } from 'users/users.service'
import { SessionsService } from './sessions.service'
import { GlobalService } from 'global/global.service'

describe('SessionsService', () => {
  let service: SessionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [SessionsService, UsersService, ESService, GlobalService]
    }).compile()

    service = module.get<SessionsService>(SessionsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})

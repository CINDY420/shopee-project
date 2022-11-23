import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { UsersService } from 'users/users.service'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'
import { GlobalService } from 'global/global.service'

describe('SessionsController', () => {
  let controller: SessionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [SessionsController],
      providers: [SessionsService, UsersService, ESService, GlobalService]
    }).compile()

    controller = module.get<SessionsController>(SessionsController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

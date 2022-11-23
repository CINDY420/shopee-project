import { Test, TestingModule } from '@nestjs/testing'
import { ServicesController } from './services.controller'
import { ConfigModule } from '@nestjs/config'
import { ServicesService } from './services.service'
import { ESService } from 'common/modules/es/es.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { AuthService } from 'common/modules/auth/auth.service'

import configuration from 'common/config/configuration'
describe('ServicesController', () => {
  let controller: ServicesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [ServicesController],
      providers: [ServicesService, ESService, AgentService, AuthService]
    }).compile()

    controller = module.get<ServicesController>(ServicesController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

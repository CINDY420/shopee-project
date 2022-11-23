import { Test, TestingModule } from '@nestjs/testing'
import { ServicesService } from './services.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ESService } from 'common/modules/es/es.service'
import { ConfigModule } from '@nestjs/config'

import configuration from 'common/config/configuration'

describe('ServicesService', () => {
  let service: ServicesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [ServicesService, AgentService, ESService]
    }).compile()

    service = module.get<ServicesService>(ServicesService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { ClientManagerService } from './client-manager.service'
import { ESService } from 'common/modules/es/es.service'
import configuration from 'common/config/configuration'
import { ConfigModule } from '@nestjs/config'

describe('ClientManagerService', () => {
  let service: ClientManagerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [ClientManagerService, ESService]
    }).compile()

    service = module.get<ClientManagerService>(ClientManagerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { PolicyService } from './policy.service'
import { ESService } from 'common/modules/es/es.service'

describe('PolicyService', () => {
  let service: PolicyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolicyService, ESService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ]
    }).compile()

    service = module.get<PolicyService>(PolicyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

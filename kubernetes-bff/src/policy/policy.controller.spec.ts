import { CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { PolicyController } from 'policy/policy.controller'
import { PolicyService } from 'policy/policy.service'
import { ESService } from 'common/modules/es/es.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('PolicyController', () => {
  let controller: PolicyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyController],
      providers: [ESService, PolicyService, AuthService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register()
      ]
    }).compile()

    controller = module.get<PolicyController>(PolicyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

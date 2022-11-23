import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { RbacController } from './rbac.controller'
import { RbacService } from './rbac.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('RbacController', () => {
  let controller: RbacController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [RbacController],
      providers: [RbacService, ESService, AuthService]
    }).compile()

    controller = module.get<RbacController>(RbacController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

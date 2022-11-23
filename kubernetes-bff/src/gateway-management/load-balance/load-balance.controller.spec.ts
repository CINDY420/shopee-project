import { Test, TestingModule } from '@nestjs/testing'
import { LoadBalanceController } from './load-balance.controller'
import { ConfigModule } from '@nestjs/config'
import configuration from 'common/config/configuration'
import { LoadBalanceService } from './load-balance.service'

describe('LoadBalanceController', () => {
  let controller: LoadBalanceController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [LoadBalanceController],
      providers: [LoadBalanceService]
    }).compile()

    controller = module.get<LoadBalanceController>(LoadBalanceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

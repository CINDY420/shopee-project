import { Test, TestingModule } from '@nestjs/testing'
import { LoadBalanceService } from './load-balance.service'

describe('LoadBalanceService', () => {
  let service: LoadBalanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadBalanceService]
    }).compile()

    service = module.get<LoadBalanceService>(LoadBalanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

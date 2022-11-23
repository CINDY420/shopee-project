import { Test, TestingModule } from '@nestjs/testing'
import { PrometheusAppService } from './prometheusApp.service'

describe('PrometheusAppService', () => {
  let service: PrometheusAppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrometheusAppService]
    }).compile()

    service = module.get<PrometheusAppService>(PrometheusAppService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

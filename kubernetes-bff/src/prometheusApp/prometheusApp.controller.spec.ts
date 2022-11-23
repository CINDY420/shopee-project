import { Test, TestingModule } from '@nestjs/testing'
import { PrometheusAppController } from './prometheusApp.controller'
import { PrometheusAppService } from './prometheusApp.service'

describe('PrometheusAppController', () => {
  let controller: PrometheusAppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrometheusAppController],
      providers: [PrometheusAppService]
    }).compile()

    controller = module.get<PrometheusAppController>(PrometheusAppController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

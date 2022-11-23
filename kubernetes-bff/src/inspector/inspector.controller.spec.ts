import { Test, TestingModule } from '@nestjs/testing'
import { InspectorController } from './inspector.controller'

jest.mock('heapdump', () => {
  return { isMock: true }
})

describe('InspectorController', () => {
  let controller: InspectorController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectorController]
    }).compile()

    controller = module.get<InspectorController>(InspectorController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

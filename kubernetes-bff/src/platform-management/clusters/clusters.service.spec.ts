import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ClustersService } from './clusters.service'
import { CacheModule } from '@nestjs/common'

describe('ClustersService', () => {
  let service: ClustersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register()
      ],
      providers: [ClustersService, ESService, ApiServerService]
    }).compile()

    service = module.get<ClustersService>(ClustersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

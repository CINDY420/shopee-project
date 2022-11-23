import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'

import configuration from 'common/config/configuration'

import { IngressesService } from './ingresses.service'
import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { CacheModule } from '@nestjs/common'

describe('IngressesService', () => {
  let service: IngressesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register()
      ],
      providers: [IngressesService, ESService, ClustersService, ConfigService, ApiServerService]
    }).compile()

    service = module.get<IngressesService>(IngressesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

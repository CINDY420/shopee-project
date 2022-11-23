import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import configuration from 'common/config/configuration'

import { IngressesController } from './ingresses.controller'

import { IngressesService } from './ingresses.service'
import { ESService } from 'common/modules/es/es.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { CacheModule } from '@nestjs/common'

describe('IngressesController', () => {
  let controller: IngressesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        CacheModule.register()
      ],
      controllers: [IngressesController],
      providers: [IngressesService, ESService, ClustersService, ApiServerService]
    }).compile()

    controller = module.get<IngressesController>(IngressesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

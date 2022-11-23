import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('GroupsController', () => {
  let controller: GroupsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [GroupsController],
      providers: [GroupsService, ESService, ClustersService, ApiServerService, MetricsService, AuthService]
    }).compile()

    controller = module.get<GroupsController>(GroupsController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

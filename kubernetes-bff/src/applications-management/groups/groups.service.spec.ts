import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { GroupsService } from './groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('GroupsService', () => {
  let service: GroupsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [GroupsService, ESService, ClustersService, ApiServerService, MetricsService, AuthService]
    }).compile()

    service = module.get<GroupsService>(GroupsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})

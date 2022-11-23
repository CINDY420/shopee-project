import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { TreesController } from './trees.controller'
import { TreesService } from './trees.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('GroupsController', () => {
  let controller: TreesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [TreesController],
      providers: [
        TreesService,
        ESService,
        ProjectsService,
        ApiServerService,
        MetricsService,
        GroupsService,
        ClustersService,
        AgentService,
        AuthService
      ]
    }).compile()

    controller = module.get<TreesController>(TreesController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

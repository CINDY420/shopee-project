import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { DeploymentsController } from './deployments.controller'
import { DeploymentsService } from './deployments.service'

import configuration from 'common/config/configuration'
import { AgentService } from 'common/modules/agent/agent.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ESService } from 'common/modules/es/es.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('DeploymentsController', () => {
  let controller: DeploymentsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [DeploymentsController],
      providers: [
        DeploymentsService,
        AgentService,
        ClustersService,
        ApiServerService,
        ESService,
        MetricsService,
        ProjectsService,
        GroupsService,
        ApplicationsService,
        AuthService
      ]
    }).compile()

    controller = module.get<DeploymentsController>(DeploymentsController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

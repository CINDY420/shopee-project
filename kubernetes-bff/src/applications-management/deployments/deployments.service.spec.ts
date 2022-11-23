import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { DeploymentsService } from './deployments.service'

import configuration from 'common/config/configuration'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'
import { ESService } from 'common/modules/es/es.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { GroupsService } from 'applications-management/groups/groups.service'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('DeploymentsService', () => {
  let service: DeploymentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
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

    service = module.get<DeploymentsService>(DeploymentsService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})

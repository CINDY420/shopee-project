import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { DeployConfigService } from 'deploy-config/deploy-config.service'
import { IGetDeployConfigResponse } from 'deploy-config/dto/deploy-config-openapi.dto'
import { ResourceDesc } from 'deploy-config/dto/deploy-config.dto'
import configuration from 'common/config/configuration'

describe('DeployConfigService', () => {
  let service: DeployConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [DeployConfigService, OpenApiService, ConfigService]
    }).compile()

    service = module.get<DeployConfigService>(DeployConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it.only('test generateDeployConfigVO', () => {
    const response: IGetDeployConfigResponse = {
      code: 0,
      message: 'success',
      enable: true,
      syncWithLeap: true,
      version: 1,
      template: {
        type: 'statefulset',
        templateOverwrite: [
          {
            cid: 'SG',
            cluster: 'cluster1-test',
            type: 'statefulset'
          }
        ]
      },
      strategy: {
        type: 'rollingUpdate',
        rollingUpdate: {
          maxSurge: '95%',
          maxUnavailable: '20%'
        },
        strategyOverwrite: [
          {
            cid: 'SG',
            cluster: 'cluster1-test',
            type: 'rollingUpdate',
            rollingUpdate: {
              maxSurge: '95%',
              maxUnavailable: '20%'
            }
          }
        ]
      },
      deployAz: {
        cidAzs: [
          {
            cid: 'SG',
            azs: ['cluster1-test', 'cluster2-test']
          }
        ],
        instance: [
          {
            cid: 'SG',
            cluster: 'cluster1-test',
            podCount: 100,
            enableCanary: false,
            canaryInitCount: 0
          },
          {
            cid: 'SG',
            cluster: 'cluster3-test',
            podCount: 100,
            enableCanary: true,
            canaryInitCount: 10
          },
          {
            cid: 'TH',
            cluster: 'cluster2-test',
            podCount: 100,
            enableCanary: true,
            canaryInitCount: 20
          }
        ]
      },
      resources: {
        resource: {
          cpu: 1,
          gpu: 2,
          memory: 3
        },
        cidResource: { cid: { cpu: 1, gpu: 1, memory: 2 } }
      }
    }
    const res = service.generateDeployConfigVO(response)
    // eslint-disable-next-line no-console
    console.log('service.generateDeployConfigVO res: ', JSON.stringify(res, null, 2))
  })
})

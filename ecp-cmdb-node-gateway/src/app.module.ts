import { Module } from '@nestjs/common'
import { SduModule } from '@/modules/sdu/sdu.module'
import { SpaceAuthModule } from '@infra-node-kit/space-auth'
import { generateSpaceEnv } from '@/helpers/utils/generate-space-env'
import { HttpModule } from '@infra-node-kit/http'
import { FetchModule } from '@/modules/fetch/fetch.module'
import { DeploymentModule } from '@/modules/deployment/deployment.module'
import { PodModule } from '@/modules/pod/pod.module'
import { DeployConfigModule } from '@/modules/deploy-config/deploy-config.module'
import { TenantModule } from '@/modules/tenant/tenant.module'
import { ZoneModule } from '@/modules/zone/zone.module'
import { GlobalModule } from '@/modules/global/global.module'
import { ApiServerModule } from '@/shared/apiServer/apiServer.module'
import { ApmModule } from '@/modules/apm'
import { ClusterModule } from '@/modules/cluster/cluster.module'
import { PVModule } from '@/modules/pv/pv.module'
import { EcpRegionModule } from '@/modules/ecp-region'

@Module({
  imports: [
    HttpModule,
    FetchModule,
    SpaceAuthModule.forRoot({
      environment: generateSpaceEnv(),
    }),
    EcpRegionModule.forRoot(),
    SduModule,
    DeploymentModule,
    PodModule,
    DeployConfigModule,
    TenantModule,
    ZoneModule,
    GlobalModule,
    ApiServerModule,
    ApmModule.register(),
    ClusterModule,
    PVModule,
  ],
})
export class AppModule {}

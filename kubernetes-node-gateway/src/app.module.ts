import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware'
import { AppAccessLoggerMiddleware } from '@/common/middlewares/app-access-logger.middleware'
import loadConfig from '@/common/utils/load-config'
import { PingModule } from '@/features/ping/ping.module'
import { LoggerModule } from '@/shared/logger.module'
import { HttpModule } from '@/shared/http.module'
import { AuthModule } from '@/shared/auth/auth.module'
import { TicketModule } from '@/features/ticket/ticket.module'
import { RbacModule } from '@/features/rbac/rbac.module'
import { ClusterModule } from '@/features/cluster/cluster.module'
import { ElasticsearchModule } from '@/shared/elasticsearch/elasticsearch.module'
import { DeployConfigModule } from './features/deploy-config/deploy-config.module'
import { SduResourceModule } from './features/sdu-resource/sdu-resource.module'
import { ProjectModule } from '@/features/project/project.module'
import { ApplicationModule } from '@/features/application/application.module'
import { SduModule } from '@/features/sdu/sdu.module'
import { DeploymentModule } from '@/features/deployment/deployment.module'
import { DirectoryModule } from '@/features/directory/directory.module'
import { HpaModule } from '@/features/hpa/hpa.module'
import { ZoneModule } from '@/features/zone/zone.module'
import { GlobalModule } from '@/features/global/global.module'
import { TenantModule } from '@/features/tenant/tenant.module'
import { ApiServerModule } from '@/shared/apiServer/apiServer.module'

@Module({
  imports: [
    PingModule,
    LoggerModule,
    HttpModule,
    ConfigModule.forRoot({
      load: [loadConfig],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    TicketModule,
    RbacModule,
    ElasticsearchModule,
    DeployConfigModule,
    SduResourceModule,
    ProjectModule,
    ApplicationModule,
    SduModule,
    DeploymentModule,
    DirectoryModule,
    HpaModule,
    ZoneModule,
    GlobalModule,
    TenantModule,
    ClusterModule,
    ApiServerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
    consumer.apply(AppAccessLoggerMiddleware).forRoutes('*')
  }
}

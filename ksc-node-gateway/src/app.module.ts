import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware'
import { AppAccessLoggerMiddleware } from '@/common/middlewares/app-access-logger.middleware'
import { PingModule } from '@/features/ping/ping.module'
import { LoggerModule } from '@/shared/logger.module'
import { HttpModule } from '@/shared/http.module'
import { OpenApiModule } from '@/common/modules/openApi/openApi.module'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from '@/features/account/account.module'
import { TenantModule } from '@/features/tenant/tenant.module'
import { MetricsModule } from '@/features/metrics/metrics.module'
import { ClusterModule } from '@/features/cluster/cluster.module'
import { ProjectModule } from '@/features/project/project.module'
import { JobModule } from '@/features/job/job.module'
import { PeriodicJobModule } from '@/features/periodicJob/job.module'
import { SessionModule } from '@/features/session/session.module'
import { PodModule } from '@/features/pod/pod.module'
import { GlobalModule } from '@/features/global/global.module'
import { TicketModule } from '@/features/ticket/ticket.module'
import { NodeModule } from '@/features/node/node.module'
import { OperationModule } from '@/features/operationRecord/operation.module'
import configuration from '@/common/configs/configuration'

@Module({
  imports: [
    PingModule,
    LoggerModule,
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    OpenApiModule,
    AccountModule,
    TenantModule,
    ClusterModule,
    ProjectModule,
    JobModule,
    PeriodicJobModule,
    SessionModule,
    PodModule,
    GlobalModule,
    TicketModule,
    MetricsModule,
    NodeModule,
    OperationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
    consumer.apply(AppAccessLoggerMiddleware).forRoutes('*')
  }
}

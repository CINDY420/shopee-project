import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './common/config/configuration'

import { ApplicationsManagementModule } from './applications-management/applications-management.module'
import { PlatformManagementModule } from './platform-management/platform-management.module'
import { SessionsModule } from './sessions/sessions.module'
import { UsersModule } from './users/users.module'
import { ESModule } from 'common/modules/es/es.module'
import { ClientManagerModule } from 'common/modules/client-manager/client-manager.module'
import { AgentModule } from 'common/modules/agent/agent.module'
import { MetricsModule } from 'common/modules/metrics/metrics.module'
import { RbacModule } from './rbac/rbac.module'
import { NodesModule } from './nodes/nodes.module'
import { ApiServerModule } from 'common/modules/apiServer/apiServer.module'
import { PrometheusModule } from 'prometheus/prometheus.module'
import { UserLogsModule } from './userLogs/logs.module'
import { GlobalModule } from './global/global.module'
import { EventModule } from 'common/modules/event/event.module'
import { ApmModule } from './apm/apm.module'

import {
  IsKubeConfig,
  IsClusterExit,
  IsDuplicateKubeConfig,
  IsValidClusterConfigItem,
  IsClusterNotExit
} from 'common/validator'
import { GatewayManagementModule } from './gateway-management/gateway-management.module'
import { RoleModule } from './userRole/role.module'
import { MailerModule } from 'common/modules/mailer/mailer.module'
import { DirectoryModule } from './directory/directory.module'
import { RequestsModule } from './requests/requests.module'
import { IsApplicationExit } from 'common/validator/IsApplicationExit'
import { InspectorModule } from './inspector/inspector.module'
import { AuthModule } from './common/modules/auth/auth.module'
import { TicketModule } from './ticket/ticket.module'
import { OpenApiModule } from './common/modules/openApi/openApi.module'
import { PipelinesModule } from './pipeline-management/pipelines.module'
import { FreezesModule } from './release-freezes-management/freezes.module'
import { PolicyModule } from './policy/policy.module'
import { DeployConfigModule } from './deploy-config/deploy-config.module'
import { PprofModule } from './pprof/pprof.module'
import { UssModule } from 'common/modules/uss/uss.module'
import { LoggerModule } from 'common/shared/logger.module'

import { RequestIdMiddleware } from 'common/middlewares/request-id.middleware'
import { AppAccessLoggerMiddleware } from 'common/middlewares/app-access-logger.middleware'
import { ThrottlerModule } from '@nestjs/throttler'

const ValidatorServices = [
  IsKubeConfig,
  IsClusterExit,
  IsDuplicateKubeConfig,
  IsValidClusterConfigItem,
  IsClusterNotExit,
  IsApplicationExit
]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    LoggerModule,
    ApplicationsManagementModule,
    PlatformManagementModule,
    SessionsModule,
    UsersModule,
    ESModule,
    ClientManagerModule,
    AgentModule,
    MetricsModule,
    MailerModule,
    RbacModule,
    NodesModule,
    ApiServerModule,
    PrometheusModule,
    GatewayManagementModule,
    UserLogsModule,
    RoleModule,
    DirectoryModule,
    GlobalModule,
    EventModule,
    RequestsModule,
    InspectorModule,
    AuthModule,
    TicketModule,
    UssModule,
    ApmModule.register(),
    OpenApiModule,
    PipelinesModule,
    PolicyModule,
    FreezesModule,
    PprofModule,
    DeployConfigModule,
    ThrottlerModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, ...ValidatorServices]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
    consumer.apply(AppAccessLoggerMiddleware).forRoutes('*')
  }
}

import { MiddlewareConsumer, Module, NestModule, CacheModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware'
import { AppAccessLoggerMiddleware } from '@/common/middlewares/app-access-logger.middleware'
import loadConfig from '@/common/utils/load-config'
import { PingModule } from '@/features/ping/ping.module'
import { LoggerModule } from '@/shared/logger.module'
import { SpaceAuthModule, SPACE_ENVIRONMENT } from '@infra-node-kit/space-auth'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApplicationModule } from '@/features/application/application.module'
import { generateSpaceEnv } from '@/common/utils/generate-space-env'
import { UserModule } from '@/features/user/user.module'
import { HttpModule } from '@infra-node-kit/http'
import { GitlabModule } from '@/features/gitlab/gitlab.module'
import { AuthModule } from '@/features/auth/auth.module'
import { BullModule } from '@nestjs/bull'
import { ShopeeNpmModule } from '@/features/shopee-npm/shopee-npm.module'

@Module({
  imports: [
    SpaceAuthModule.forRoot({
      environment:
        generateSpaceEnv() === SPACE_ENVIRONMENT.LIVE
          ? SPACE_ENVIRONMENT.LIVE
          : SPACE_ENVIRONMENT.TEST,
    }),
    PingModule,
    LoggerModule,
    HttpModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('cache'),
      }),
    }),
    ConfigModule.forRoot({
      load: [loadConfig],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mysql'),
      }),
    }),
    ApplicationModule,
    UserModule,
    GitlabModule,
    AuthModule,
    ShopeeNpmModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
    consumer.apply(AppAccessLoggerMiddleware).forRoutes('*')
  }
}

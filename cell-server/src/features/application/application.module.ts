import { Module } from '@nestjs/common'
import { ApplicationService } from '@/features/application/application.service'
import { ApplicationController } from '@/features/application/application.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionEntity } from '@/entities/subscription.entity'
import { SpaceApiModule } from '@/shared/space-api/space-api.module'
import { BullModule } from '@nestjs/bull'
import { APP_CREATION_QUEUE } from '@/common/constants/queue'
import { ApplicationCreationService } from '@/features/application/application.creation.service'
import { ApplicationEntity } from '@/entities/application.entity'
import { GitlabModule } from '@/features/gitlab/gitlab.module'
import { UserModule } from '@/features/user/user.module'
import { ApplicationConsumer } from '@/features/application/application.consumer'

@Module({
  imports: [
    SpaceApiModule,
    GitlabModule,
    UserModule,
    TypeOrmModule.forFeature([ApplicationEntity, SubscriptionEntity]),
    BullModule.registerQueue({
      name: APP_CREATION_QUEUE,
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
    }),
  ],
  providers: [ApplicationConsumer, ApplicationService, ApplicationCreationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}

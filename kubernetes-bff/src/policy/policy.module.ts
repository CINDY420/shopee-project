import { Module } from '@nestjs/common'

import { ESModule } from 'common/modules/es/es.module'
import { PolicyService } from 'policy/policy.service'
import { PolicyController } from 'policy/policy.controller'

@Module({
  imports: [ESModule],
  providers: [PolicyService],
  controllers: [PolicyController],
  exports: [PolicyService]
})
export class PolicyModule {}

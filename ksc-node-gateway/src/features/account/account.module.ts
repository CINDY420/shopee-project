import { Module } from '@nestjs/common'
import { AccountController } from '@/features/account/account.controller'
import { AccountService } from '@/features/account/account.service'

@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

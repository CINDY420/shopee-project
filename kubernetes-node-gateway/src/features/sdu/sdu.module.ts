import { Module } from '@nestjs/common'
import { SduService } from '@/features/sdu/sdu.service'
import { SduController } from '@/features/sdu/sdu.controller'

@Module({
  imports: [SduService],
  controllers: [SduController],
  providers: [SduService],
})
export class SduModule {}

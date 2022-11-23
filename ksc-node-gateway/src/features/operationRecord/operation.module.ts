import { Module } from '@nestjs/common'
import { OperationController } from '@/features/operationRecord/operation.controller'

@Module({
  controllers: [OperationController],
})
export class OperationModule {}

import { Module } from '@nestjs/common'
import { NodeController } from '@/features/node/node.controller'

@Module({
  controllers: [NodeController],
})
export class NodeModule {}

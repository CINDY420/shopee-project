import { Module } from '@nestjs/common'
import { NodeController } from '@/modules/node/node.controller'
import { NodeService } from '@/modules/node/node.service'

@Module({
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}

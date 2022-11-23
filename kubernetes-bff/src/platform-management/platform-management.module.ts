import { Module } from '@nestjs/common'
import { ClustersModule } from './clusters/clusters.module'

@Module({
  imports: [ClustersModule]
})
export class PlatformManagementModule {}

import { Module } from '@nestjs/common'
import { ApplicationsModule } from './applications/applications.module'
import { ProjectsModule } from './projects/projects.module'
import { GroupsModule } from './groups/groups.module'
import { DeploymentsModule } from './deployments/deployments.module'
import { PodsModule } from './pods/pods.module'
import { TreesModule } from './trees/trees.module'

@Module({
  imports: [ApplicationsModule, GroupsModule, ProjectsModule, DeploymentsModule, PodsModule, TreesModule]
})
export class ApplicationsManagementModule {}

import { Module } from '@nestjs/common'
import { DirectoryController } from './directory.controller'
import { DirectoryService } from './directory.service'
import { ApplicationsModule } from 'applications-management/applications/applications.module'

@Module({
  controllers: [DirectoryController],
  imports: [ApplicationsModule],
  providers: [DirectoryService]
})
export class DirectoryModule {}

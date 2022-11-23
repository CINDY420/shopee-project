import { Module } from '@nestjs/common'
import { DirectoryController } from '@/features/directory/directory.controller'
import { DirectoryService } from '@/features/directory/directory.service'

@Module({
  controllers: [DirectoryController],
  imports: [DirectoryService],
  providers: [DirectoryService],
})
export class DirectoryModule {}

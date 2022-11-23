import { UserEntity } from '@/entities/user.entity'
import { Module } from '@nestjs/common'
import { UserController } from '@/features/user/user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from '@/features/user/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

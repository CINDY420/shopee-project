import { Module } from '@nestjs/common'
import { ShopeeNpmController } from '@/features/shopee-npm/shopee-npm.controller'
import { ShopeeNpmService } from '@/features/shopee-npm/shopee-npm.service'

@Module({
  imports: [],
  controllers: [ShopeeNpmController],
  providers: [ShopeeNpmService],
})
export class ShopeeNpmModule {}

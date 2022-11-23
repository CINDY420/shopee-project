import {
  ResolveFileTreeBody,
  ResolveFileTreeParams,
} from '@/features/shopee-npm/dtos/resolve-file-tree.dto'
import { ResolveNpmFileContent, ResolveNpmParams } from '@/features/shopee-npm/dtos/resolve-npm.dto'
import { ShopeeNpmService } from '@/features/shopee-npm/shopee-npm.service'
import { parsePackageName } from '@/features/shopee-npm/utils/parse-package-name'
import { Controller, Get, Param } from '@nestjs/common'
import { PackagesJsonEntity } from '@/features/shopee-npm/dtos/packages-json.entity'
import { PackageJsonEntity } from '@/features/shopee-npm/dtos/package-json.entity'
import { ApiExcludeController } from '@nestjs/swagger'

@ApiExcludeController()
@Controller()
export class ShopeeNpmController {
  constructor(private readonly shopeeNpmService: ShopeeNpmService) {}

  @Get('/resolve/npm/*')
  resolveNpm(
    @Param() params: ResolveNpmParams,
  ): Promise<PackageJsonEntity | PackagesJsonEntity | ResolveNpmFileContent> {
    const packageInfo = params[0]
    /**
     * packageInfo will be like:
     * /packageJSON/@nestjs/common@7.0.0/index.js
     * /packageJSON/@nestjs/common@7.0.0
     * /packageJSON/@nestjs/common
     * /packageJSON/got@1.2.0
     * /packageJSON/got
     */
    const { name, version, path } = parsePackageName(packageInfo)
    if (path.length) {
      return this.shopeeNpmService.getPackageFile(name, version, path)
    }
    if (!version.length) {
      return this.shopeeNpmService.loadPackageJson(name)
    }
    return this.shopeeNpmService.loadPackageJson(name, version)
  }

  @Get('/npm/files/*')
  resolveFileTree(@Param() params: ResolveFileTreeParams): Promise<ResolveFileTreeBody> {
    const packageInfo = params[0]
    const { name, version } = parsePackageName(packageInfo)
    return this.shopeeNpmService.resolveFileTreeFormPackage(name, version)
  }
}

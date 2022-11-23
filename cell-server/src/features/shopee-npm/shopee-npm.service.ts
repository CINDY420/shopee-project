import path from 'node:path'
import { pathExists, readFile } from 'fs-extra'
import got, { RequestError } from 'got'
import { HttpStatus, Injectable } from '@nestjs/common'

import { CustomException } from '@/common/models/custom-exception'
import { PackagesJsonEntity } from '@/features/shopee-npm/dtos/packages-json.entity'
import { PackageJsonEntity } from '@/features/shopee-npm/dtos/package-json.entity'
import { decompressNpmTgz } from '@/features/shopee-npm/utils/decompress-npm-tgz'
import { walk } from '@/features/shopee-npm/utils/fs-walk'
import { downloadFile } from '@/features/shopee-npm/utils/download-file'
import { tryCatch } from '@infra/utils'
import { Logger } from '@/common/utils/logger'

@Injectable()
export class ShopeeNpmService {
  private static readonly SHOPEE_NPM_URL = 'https://npm.shopee.io'
  private readonly logger = new Logger(ShopeeNpmService.name)
  private readonly PACKAGE_CACHE_FOLDER = path.join('/', 'tmp', 'npm-package')

  async loadPackageJson(packageName: string): Promise<PackagesJsonEntity>
  async loadPackageJson(packageName: string, version: string): Promise<PackageJsonEntity>
  async loadPackageJson(packageName: string, version?: string) {
    const url = `${ShopeeNpmService.SHOPEE_NPM_URL}/${packageName}${version ? `/${version}` : ''}`
    this.logger.log(`loadPackageJson: ${url}`)

    const result = await got.get(url).catch((e: RequestError) => {
      if (e.response?.statusCode === HttpStatus.NOT_FOUND) {
        throw new CustomException(
          `loadPackageJson: ${packageName}@${version} not found`,
          -1,
          HttpStatus.NOT_FOUND,
        )
      }
      throw new CustomException(
        `loadPackageJson: ${packageName}@${version} load error`,
        -1,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    })

    // if version is specified, return the `package.json` of the version
    if (version) {
      const packageJSONInfo: PackageJsonEntity = JSON.parse(result.body)
      return packageJSONInfo
    }
    // if version is not specified, return a list of versions
    const packagesJSONInfo: PackagesJsonEntity = JSON.parse(result.body)
    return packagesJSONInfo
  }

  private async tryReadPackageFileFromFileSystemCache(
    packageName: string,
    version: string,
    filePath: string,
  ) {
    // transform 'latest' to specific version
    const specificVersion =
      version === 'latest' ? (await this.loadPackageJson(packageName, version)).version : version
    const tgzFileName = `${packageName}/${specificVersion}.tgz`
    const tgzFilePath = path.join(this.PACKAGE_CACHE_FOLDER, tgzFileName)
    const packageFilePath = path.join(tgzFilePath, filePath)

    if (await pathExists(tgzFilePath)) {
      // hit cache
      this.logger.log(`tryReadPackageFileFromFileSystemCache ${packageName}@${version} hit cache`)

      if (!(await pathExists(packageFilePath))) {
        this.logger.log(
          `tryReadPackageFileFromFileSystemCache ${packageName}@${version}${filePath} not found`,
        )
        throw new CustomException('package file not found', -1, HttpStatus.NOT_FOUND)
      }
      return {
        fileContent: await readFile(packageFilePath, 'utf8'),
      }
    }

    return {
      fileContent: '',
    }
  }

  async downloadAndDecompressFile(packageName: string, version: string) {
    const fullPackageName = `${packageName}@${version}`
    const packageJSONInfo = await this.loadPackageJson(packageName, version)
    const tgzURL = packageJSONInfo.dist.tarball
    const specificVersion = packageJSONInfo.version
    const tgzFileName = `${packageName}/${specificVersion}.tgz`
    const tgzFilePath = path.join(this.PACKAGE_CACHE_FOLDER, tgzFileName)

    const [, downloadError] = await downloadFile(tgzURL, this.PACKAGE_CACHE_FOLDER, {
      name: tgzFileName,
      override: true,
      autoCreateFolder: true,
      quiet: true,
    })
    if (downloadError) {
      this.logger.error(`getPackageFile ${packageName} download error. ${downloadError.message}`)
      throw new CustomException(
        `${fullPackageName} download error`,
        -1,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    const [, decompressError] = await tryCatch(decompressNpmTgz(tgzFilePath))
    if (decompressError) {
      this.logger.error(
        `getPackageFile ${packageName} decompress error. ${decompressError.message}`,
      )
      throw new CustomException(
        `${fullPackageName} decompress error`,
        -1,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return tgzFilePath
  }

  async getPackageFile(packageName: string, version: string, filePath: string) {
    // try to get the package file from cache
    const cacheResult = await this.tryReadPackageFileFromFileSystemCache(
      packageName,
      version,
      filePath,
    )
    if (cacheResult.fileContent) {
      return cacheResult
    }

    // cache miss, process download and decompress
    const tgzFilePath = await this.downloadAndDecompressFile(packageName, version)
    const packageFilePath = path.join(tgzFilePath, filePath)

    if (await pathExists(packageFilePath)) {
      const fileContent = await readFile(tgzFilePath, 'utf8')
      return {
        fileContent,
      }
    }

    // still not found, throw error
    throw new CustomException(
      `getPackageFile ${packageName}${filePath} not found`,
      -1,
      HttpStatus.NOT_FOUND,
    )
  }

  async resolveFileTreeFormPackage(packageName: string, version: string) {
    const tgzFilePath = await this.downloadAndDecompressFile(packageName, version)
    const fileList: string[] = walk(tgzFilePath, [])
    const files = fileList.map((item: string) => {
      const relativePath = item.split('.tgz')[1]
      return relativePath
    })

    return { files, moduleName: packageName, version }
  }
}

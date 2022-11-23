import { Logger } from '@/common/utils/logger'
import { move, remove, mkdir, stat, createReadStream, pathExists } from 'fs-extra'
import path from 'node:path'
import tar from 'tar'

const logger = new Logger()

export const decompressNpmTgz = async (filePath: string) => {
  const parentPath = path.dirname(filePath)
  const fileName = path.basename(filePath)

  if (!fileName.endsWith('.tgz')) {
    throw new Error('File is not a tgz file')
  }

  if (await pathExists(filePath)) {
    const fileNameStat = await stat(filePath)
    if (fileNameStat.isDirectory()) {
      logger.log('File is decompressed')
      return
    }
  }

  if (await pathExists(parentPath)) {
    const parentPathStat = await stat(parentPath)
    if (parentPathStat.isFile()) {
      throw new Error(`parent path: ${parentPath} is a file`)
    }
  }

  const tmpResultPath = `${parentPath}/${fileName}-tmp`

  await mkdir(tmpResultPath, { recursive: true })

  return new Promise<void>((resolve, reject) => {
    createReadStream(path.resolve(filePath))
      .on('error', reject)
      // equal to: tar -xf filePath -C tmpResultPath
      .pipe(tar.x({ C: tmpResultPath }))
      .on('close', async () => {
        await remove(filePath)
        if (await pathExists(`${tmpResultPath}/package`)) {
          // for normal package like semver, tgz decompress result folder name is "package"
          await move(`${tmpResultPath}/package`, filePath, { overwrite: true })
        } else {
          // for @types package like @types/semver, tgz decompress result folder name is "semver" (the name of package)
          const packageName = /@types\/(.+)\/(.+).tgz/.exec(filePath)?.[1]
          if (await pathExists(`${tmpResultPath}/${packageName}`)) {
            await move(`${tmpResultPath}/${packageName}`, filePath, { overwrite: true })
          }
        }
        await remove(tmpResultPath)
        resolve()
      })
  })
}

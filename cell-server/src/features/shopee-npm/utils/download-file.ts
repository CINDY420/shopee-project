import { Logger } from '@/common/utils/logger'
import { tryCatch } from '@infra/utils'
import { randomUUID } from 'crypto'
import { createWriteStream, mkdir, pathExists, stat } from 'fs-extra'
import got, { Progress } from 'got'
import path from 'node:path'
import { Stream } from 'stream'
import { promisify } from 'util'

const logger = new Logger()

export const downloadFile = async (
  sourceUrl: string,
  destinationFolder: string,
  options?: {
    name?: string
    override?: boolean
    autoCreateFolder?: boolean
    quiet?: boolean
  },
): Promise<[unknown, Error | null]> => {
  // calculate destinationPath
  const fileName = options?.name ?? path.basename(sourceUrl)
  const destinationPath = path.join(destinationFolder, fileName)
  /*
   * due to fileName may be `a/b/c.xxx`
   * trueDestinationFolder will be `${destinationFolder}a/b/c.xxx`
   */
  const trueDestinationFolder = path.dirname(destinationPath)

  // check if destinationFolder exists and is a folder
  const isDestinationFolderAlreadyExisted = await pathExists(trueDestinationFolder)
  if (isDestinationFolderAlreadyExisted) {
    const folderStat = await stat(trueDestinationFolder)
    if (!folderStat.isDirectory()) {
      logger.log('destinationFolder is not a folder')
    }
  } else {
    if (!options?.autoCreateFolder) {
      throw new Error('destinationFolder is not existed')
    }
    await mkdir(trueDestinationFolder, { recursive: true })
  }

  // check if destinationPath exists
  const isFileAlreadyExisted = await pathExists(destinationPath)
  if (isFileAlreadyExisted) {
    const fileStat = await stat(destinationPath)
    if (!fileStat.isFile()) {
      logger.log('destination file is a existed folder')
    }
    if (!options?.override) {
      throw new Error('destination file is already existed')
    }
    return [null, null]
  }

  const uuid = randomUUID()
  const pipeline = promisify(Stream.pipeline)
  const downloadStream = got.stream(sourceUrl)

  let stepPercent = 10
  downloadStream.on('downloadProgress', (progress: Progress) => {
    if (progress.percent * 100 >= stepPercent) {
      if (!options?.quiet) {
        logger.log(`[${uuid}] download file progress: ${stepPercent}%`)
        stepPercent += 10
      }
    }
  })

  const [result, error] = await tryCatch(
    pipeline(downloadStream, createWriteStream(destinationPath)),
  )
  if (!error) {
    logger.log(`[${uuid}] download file finished`)
  }
  return [result, error]
}

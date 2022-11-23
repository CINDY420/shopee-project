import { PathLike } from 'fs'
import { access } from 'fs/promises'
import { tryCatch } from '@/common/utils/try-catch'

export const isExisted = async (path: PathLike) => {
  const [, error] = await tryCatch(access(path))
  return !error
}

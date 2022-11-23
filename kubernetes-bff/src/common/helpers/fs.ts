import * as fs from 'fs'

export const createDirIfNotExist = (dirName: string) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName)
  }
}

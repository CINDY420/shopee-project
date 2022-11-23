import { readdirSync, statSync } from 'fs-extra'
import path from 'node:path'

export const walk = (dir: string, fileList: string[] = []) => {
  const files = readdirSync(dir)
  files.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      walk(path.join(dir, item), fileList)
    } else {
      fileList.push(fullPath)
    }
  })
  return fileList
}

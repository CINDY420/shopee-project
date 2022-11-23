import * as path from 'path'
import * as fs from 'fs'

export default function generateAlias() {
  const srcPath = path.resolve(path.join(__dirname, '../src/'))
  const files: string[] = fs.readdirSync(srcPath)

  const alias: Record<string, string> = {}
  files.forEach((item: string) => {
    const targetPath = srcPath + '/' + item
    const stat: fs.Stats = fs.lstatSync(targetPath)
    if (stat.isDirectory()) {
      alias[item] = targetPath
    }
  })

  return alias
}

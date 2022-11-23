import { compile } from '@cell/compiler'
import { ICellFilesTransferObject } from '@cell/common'
import { getCellFilesTransferObject } from './format'

const fs = require("fs")
const path = require('path')

const baseDir = './app'

// mkdir form path string
const mkdirs = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirs(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

const compileApp = async (data: ICellFilesTransferObject) => {
  const compileResult = await compile(data)
  
  compileResult?.forEach((item) =>{
    const { path: pathName, code } = item
    const { dir, base } = path.parse(pathName)

    const dirName = `${baseDir}/${dir}`

    dir && mkdirs(dirName)

    const fileDirName = dir.length > 0 ? `${baseDir}/${dir}/${base}` : `${baseDir}/${base}`

    fs.writeFile(fileDirName, code, err => {
      if (err) {
        throw(err)
      }
    })
  })
}

compileApp(getCellFilesTransferObject('./cellConfig'))


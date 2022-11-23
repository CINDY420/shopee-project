import {
  ICellFilesTransferObject,
} from '@cell/common'

const fs = require('fs')
const path = require("path")

// get folder name of dirname
const getDirs = (dirname: string): string[] => {
  let dirs = []
  const dirInfo = fs.readdirSync(dirname);
  dirInfo.forEach(item => {
    const location = path.join(dirname, item)
    const info = fs.statSync(location)
    if(info.isDirectory()){
        dirs.push(location)
        getDirs(location)
    }
  })
  return dirs
}

// get parsed data of a json file
const getJsonFileData = (filePath: string): string => {
  const data = fs.readFileSync(filePath)
  const parsedJsonData = JSON.parse(data)
  const stringifiedJsonData = JSON.stringify(parsedJsonData)
  return stringifiedJsonData
}

// transfer file data to compile params data (ICellFilesTransferObject data)
export const getCellFilesTransferObject = (dirName: string): ICellFilesTransferObject => {

  const allFilesName: string[] = fs.readdirSync(dirName)
  
  const cellObject: ICellFilesTransferObject = {
    endpoints: {},
    schemas: {},
    swaggers: {},
    'cell.json': `{
      "cell": "0.0.1",
    "info": {
    "name": "",
    "description": "",
    "port": "3000"
      },
    "services": [],
    "tag": []
    }`,
    'package.json': '{}'
  }

  allFilesName?.forEach((fileName) => {
    switch (fileName) {
      case 'cell.json':
        const cellPackageData = getJsonFileData(`${dirName}/${fileName}`)
        cellObject['cell.json'] = cellPackageData
        break
      case 'package.json':
        const packagePackageData = getJsonFileData(`${dirName}/${fileName}`)
        cellObject['package.json'] = packagePackageData
        break
      case 'swaggers':
        const allSwaggerJsonFiles = fs.readdirSync(`${dirName}/${fileName}`) 

        allSwaggerJsonFiles?.forEach((swaggerJsonFilesPath) => {
          const { name } = path.parse(swaggerJsonFilesPath)
          const swaggerName = name.split('.')[0]
  
          const swaggerPackageData = getJsonFileData(`${dirName}/${fileName}/${swaggerJsonFilesPath}`)
          cellObject.swaggers[swaggerName] = swaggerPackageData
        })
        break
      case 'endpoints': 
        const allDirsUnderEndpoints = getDirs(`${dirName}/${fileName}`) 

        allDirsUnderEndpoints?.forEach(dir => {
          const endpointName = dir.split('/').at(-1)

          const filesUnderEndpoint = fs.readdirSync(dir)

          const handleFile = filesUnderEndpoint.find(item => path.parse(item).ext === '.ts')
          const handleFileData = fs.readFileSync(`${dir}/${handleFile}`, "utf8")

          const endpointFile = filesUnderEndpoint.find(item => path.parse(item).ext === '.json')
          const endpointJsonData = getJsonFileData(`${dir}/${endpointFile}`)
          
          cellObject.endpoints[endpointName] = {
            'endpoint.json': endpointJsonData,
            'handler.ts': handleFileData.toString()
          }
        })
        break
      case 'schemas':
        const allSchemesJsonFiles = fs.readdirSync(`${dirName}/${fileName}`)

        allSchemesJsonFiles?.forEach((schemesJsonFilesPath) => {
          const { name, ext } = path.parse(schemesJsonFilesPath)
          const schemasName = `${name.split('.')[0]}${ext}`
  
          const schemasPackageData = getJsonFileData(`${dirName}/${fileName}/${schemesJsonFilesPath}`)
          cellObject.schemas[schemasName] = schemasPackageData
        })
        break
      }
    })

  return cellObject
}

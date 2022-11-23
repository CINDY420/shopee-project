import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { v4 as uuidv4 } from 'uuid'
import * as child_process from 'child_process'
const exec = child_process.exec

export const envVars = {
  extensionPath: ''
}

/**
 * @returns new uuid
 */
export const getUUID = () => {
  return uuidv4()
}

let lastLogTimestamp = 0
const logFilePath = () => `${envVars.extensionPath}/logs/log.text`
const webviewLogFilePath = () => `${envVars.extensionPath}/logs/inspectWebview.html`

const appendToLog = (text: any, isAppend = true, filePath = '') => {
  fs.writeFile(filePath || logFilePath(), text + '\n', { flag: isAppend ? 'a+' : 'w+' }, (err: any) => {
    if (err) {
      console.error(err)
    }
  })
}

/**
 * log to file
 */
const log = (text: any) => {
  const now = new Date()
  const gap = now.getTime() - lastLogTimestamp
  // add some blank rows
  if (gap > 5 * 1000) {
    if (gap > 120 * 1000) {
      appendToLog('\n\n')
    }
    appendToLog('')
  }
  lastLogTimestamp = now.getTime()
  appendToLog(new Date().toISOString() + ' ' + text)
}
export const logInfo = (text: any) => log(`[Info] ${text}`)
export const logWarn = (text: any) => log(`[Warn] ${text}`)
export const logError = (text: any) => log(`[Error] ${text}`)
export const showInfo = (text: any) => {
  vscode.window.showInformationMessage(text)
  logInfo(text)
}
export const showError = (text: any) => {
  vscode.window.showErrorMessage(text)
  logError(text)
}
export const logWebview = (text: any) => {
  appendToLog(text, false, webviewLogFilePath())
}

/**
 * get project path
 */
export const getProjectPath = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return ''
  }
  if (workspaceFolders.length > 1) {
    console.error('more than one workspaceFolders')
  }
  return workspaceFolders[0].uri.fsPath
}

/**
 * getExtensionFileAbsolutePath
 * @param context 
 * @param relativePath file path compare to root  path images/test.jpg
 */
export const getExtensionFileAbsolutePath = (context: vscode.ExtensionContext, relativePath: string) => {
  return path.join(context.extensionPath, relativePath)
}

/**
 *  open url in default browser
 */
export const openUrlInBrowser = (url: string) => {
  logInfo('open url in default browser, url: ' + url)
  exec(`open '${url}'`)
}

/**
 * get current project name
 */
export const getProjectName = (projectPath: string) => {
  return path.basename(projectPath)
}

/**
 * @param filePath e.g. /a/b/f.png
 * @returns /a/b
 */
export const getDirPath = (filePath: string) => filePath.substring(0, filePath.lastIndexOf('/') + 1)
/**
 * @param filePath e.g. /a/b/f.png
 * @returns f.png
 */
export const getFileName = (filePath: string) => filePath.substring(filePath.lastIndexOf('/') + 1)
/**
 * @param filePath e.g. /a/b/f.png
 * @returns png
 */
export const getFileType = (filePath: string) => filePath.substring(filePath.lastIndexOf('.') + 1)

/**
 * rename file by file path
 * @param filePath e.g. /a/b/f.png
 * @param filePath e.g. newName.png
 */
export const renameFile = (filePath: string, newName: string) => {
  fs.renameSync(filePath, getDirPath(filePath) + newName)
}

/**
 * delete file by file path 
 * @param filePath e.g. /a/b/f.png
 */
export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err)
      return false
    }
    return true
  })
}

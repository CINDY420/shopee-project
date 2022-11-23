import * as vscode from 'vscode'
import { envVars } from './helpers/utils'
import { registerSidebar } from './sidebar'
import { registryAllWebviews } from './webviewController'
import { registryStatusBarItem } from './statusBarItem'
import path = require('path')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "tap-table" is now active!')
  envVars.extensionPath = path.join(context.extensionPath, './')
  registryAllWebviews(context)
  registerSidebar(context)
  registryStatusBarItem(context)
}

// this method is called when your extension is deactivated
export function deactivate() {}

import * as vscode from 'vscode'
import { SidebarView } from './SidebarView'

const addSidebarWebview = (context: vscode.ExtensionContext, viewId: string, currentView: string) => {
  const sidebar: SidebarView = new SidebarView(context, currentView)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(viewId, sidebar, {
      webviewOptions: {
        retainContextWhenHidden: false
      }
    })
  )
}

export const registerSidebar = (context: vscode.ExtensionContext) => {
  addSidebarWebview(context, 'vscodeInfra.webviewTableGenerator', 'TableGenerator')
}

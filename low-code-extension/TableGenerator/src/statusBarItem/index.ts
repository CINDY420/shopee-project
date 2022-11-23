import * as vscode from 'vscode'
import { NATIVE_CMD } from '../constants'

export const registryStatusBarItem = function (context: vscode.ExtensionContext) {
    if (process.env.NODE_ENV === 'development') {
        const reloadBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1)

        reloadBar.text = `$(debug-restart)`
        reloadBar.tooltip = 'Reload Webview'
        reloadBar.command = NATIVE_CMD.WORKBENCH_ACTION_WEBVIEW_RELOAD_WEBVIEW_ACTION
        reloadBar.show()
    }
}
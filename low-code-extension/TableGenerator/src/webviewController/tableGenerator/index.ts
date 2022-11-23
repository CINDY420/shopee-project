import * as vscode from 'vscode'
import { DIST_WEBVIEW_INDEX_HTML, EXTENSION_COMMANDS, MESSAGE_CMD, WEBVIEW_NAMES } from '../../constants'
import { showError, showInfo } from '../../helpers/utils'
import { IMessage, IWebview, IWebviewProps } from '../type'
import { invokeCallback } from '../util/webviewUtils'
import { generateCode, getSourceData } from './util'

const viewType = WEBVIEW_NAMES.TableGenerator
const webviewProps: IWebviewProps = {
  command: EXTENSION_COMMANDS.OPEN_WEBVIEW_TABLE_GENERATOR,
  htmlPath: DIST_WEBVIEW_INDEX_HTML,
  currentView: WEBVIEW_NAMES.TableGenerator,
  panelParams: {
    viewType,
    title: 'Table Generator',
    showOptions: vscode.ViewColumn.One,
    options: {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  },
  iconPath:'assets/logo.svg'
}

const messageHandlers = new Map([
  [
    MESSAGE_CMD.GET_SOURCE_DATA,
    async (message: IMessage) => {
      invokeCallback(viewType, message, await getSourceData())
    }
  ],
  [
    MESSAGE_CMD.PREVIEW,
    async (message: IMessage) => {
      const { columns, apiName, request, rowKey, actions, moreActions, formValue, selectedSearchBy } =  message.data
      if (!request) {
        showError('Please select the fetch API')
        return
      }
      try {
        invokeCallback(viewType, message, await generateCode({ 
          columns, apiName, request, rowKey, actions, moreActions, formValue, selectedSearchBy 
        }))
        showInfo('Code is generated successfully')
      } catch (error: any) {
        showError(error.toString())
      }
    }
  ]
])

const webview: IWebview = { webviewProps, messageHandlers }
export default webview
import { ExtensionContext } from 'vscode'
import tableGenerator from './tableGenerator'
import { registryWebview } from './util/webviewUtils'

export const registryAllWebviews = function (context: ExtensionContext) {
  registryWebview(context, tableGenerator)
}

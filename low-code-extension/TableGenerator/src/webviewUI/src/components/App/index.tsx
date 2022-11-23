import { WEBVIEW_NAMES } from '../../../../constants'
import TableGenerator from './TableGenerator'

const viewMap = {
  TableGenerator
}

let currentView = (window as any).currentView
if (!currentView || currentView === '$currentView$') {
  const isInExtension = location.protocol === 'vscode-webview:'
  if (isInExtension) {
    currentView = WEBVIEW_NAMES.Portal
  } else {
    currentView = location.pathname.replace('/', '') || WEBVIEW_NAMES.Portal
  }
}

export default viewMap[currentView]

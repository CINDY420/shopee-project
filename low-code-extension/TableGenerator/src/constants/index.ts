/* eslint-disable @typescript-eslint/naming-convention */

export const DIST_WEBVIEW_PATH = 'distWebview'
export const DIST_WEBVIEW_INDEX_HTML = `${DIST_WEBVIEW_PATH}/index.html`

export const WEBVIEW_NAMES = {
  Portal: 'Portal',
  TableGenerator: 'TableGenerator',
}

export const NATIVE_CMD = {
  WORKBENCH_ACTION_WEBVIEW_RELOAD_WEBVIEW_ACTION: 'workbench.action.webview.reloadWebviewAction',
}

// prevent duplicate CMDs
export const MESSAGE_CMD = {
  /* Common */
  EXECUTE_SPECIFIC_COMMAND: 'executeSpecificCommand',
  EXECUTE_CHILD_PROCESS: 'executeChildProcess',
  LOG_INFO: 'logInfo', // log for debug

  GET_SOURCE_DATA: 'getSourceData',
  PREVIEW: 'preview',
}

export const EXTENSION_NAME = 'tap-table'

export const EXTENSION_COMMANDS = {
  OPEN_WEBVIEW_TABLE_GENERATOR: `${EXTENSION_NAME}.openWebviewTableGenerator`
}

import {
  CancellationToken,
  Disposable,
  Event,
  EventEmitter,
  ExtensionContext,
  ViewColumn,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext
} from 'vscode'
import { DIST_WEBVIEW_INDEX_HTML } from '../constants'
import { IMessage } from '../webviewController/type'
import { getWebViewContent, handleWebviewMessage, setSidebarWebview } from '../webviewController/util/webviewUtils'

export class SidebarView implements Disposable, WebviewViewProvider {
  private _webview: WebviewView | undefined
  private _disposable: Disposable | undefined
  private _currentView: string

  constructor(private readonly extensionContext: ExtensionContext, currentView: string = '') {
    this._currentView = currentView
  }

  public refresh() {
    if (!this._webview) {
      // its not available to refresh yet
      return
    }
    this._webview.webview.html = this.getHtml()
  }

  private _onDidClose = new EventEmitter<void>()
  get onDidClose(): Event<void> {
    return this._onDidClose.event
  }

  // this is called when a view first becomes visible. This may happen when the view is first loaded
  // or when the user hides and then shows a view again
  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext<unknown>,
    token: CancellationToken
  ) {
    if (!this._webview) {
      this._webview = webviewView
    }
    this._webview.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [this.extensionContext.extensionUri]
    }

    this._disposable = Disposable.from(this._webview.onDidDispose(this.onWebviewDisposed, this))

    this._webview.webview.html = this.getHtml()
    const handleReceiveMessage = (msg: IMessage) => this?._webview && handleWebviewMessage(msg, this._webview.webview)
    this._webview.webview.onDidReceiveMessage(handleReceiveMessage, undefined, this.extensionContext.subscriptions)
    setSidebarWebview(this._webview)
  }

  dispose() {
    this._disposable && this._disposable.dispose()
  }

  private onWebviewDisposed() {
    this._onDidClose.fire()
  }

  get viewColumn(): ViewColumn | undefined {
    return undefined
  }

  get visible() {
    return this._webview ? this._webview.visible : false
  }

  private getHtml(): string {
    let html = getWebViewContent(this.extensionContext, DIST_WEBVIEW_INDEX_HTML)
    if (this._currentView) {
      html = html.replace('$currentView$', this._currentView)
    }
    return html
  }
}

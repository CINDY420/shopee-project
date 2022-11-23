import { TAB_SYMBOL, NEW_LINE_SYMBOL } from './constant'

class IndentManger {
  stack = []

  getCurrentIdent () {
    return this.stack.length ? this.stack[this.stack.length - 1] : ''
  }

  /**
   * add indent to the indent stack
   */
  addIndent () {
    this.stack.push(this.getCurrentIdent() + TAB_SYMBOL)
  }

  popIndent () {
    this.stack.pop()
  }

  indent (input: string) {
    return input + this.getCurrentIdent()
  }

  indentMultiLines (lines: string) {
    return lines
      .split(NEW_LINE_SYMBOL)
      .map((line: string) => this.getCurrentIdent() + line)
      .join(NEW_LINE_SYMBOL)
  }
}

export default IndentManger

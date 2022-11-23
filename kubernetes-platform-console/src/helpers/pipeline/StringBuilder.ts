import IndentManager from './IndentManager'
import LineTracker from './LineTracker'

class StringBuilder {
  indentManager = new IndentManager()
  lineTracker = new LineTracker()
  blockStartSymbol = '{'
  blockEndSymbol = '}'
  result = ''

  appendText (text: string) {
    this.lineTracker.scanNewLines(text)
    this.result += this.indentManager.indentMultiLines(text)
  }

  indent () {
    this.result = this.indentManager.indent(this.result)
  }

  newLine () {
    this.result = this.lineTracker.newLine(this.result)
  }

  get currentLineNumber () {
    return this.lineTracker.current
  }

  /**
   * create a new semantic block
   * new line is appended
   * @param identifier block identifier
   */
  newBlock (identifier) {
    this.result += identifier
    this.result += ' ' + this.blockStartSymbol
    this.indentManager.addIndent()
    this.newLine()
  }

  /**
   * end a semantic block
   * pop the indent from stack and insert a block symbol
   */
  endBlock () {
    this.indentManager.popIndent()
    this.result = this.lineTracker.newLine(this.result)
    this.indent()
    this.result += this.blockEndSymbol
  }
}

export default StringBuilder

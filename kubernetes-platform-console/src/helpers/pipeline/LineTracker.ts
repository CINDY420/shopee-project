import { NEW_LINE_SYMBOL } from './constant'

class LineTracker {
  current = 1

  newLine (input: string) {
    this.current++
    return input + NEW_LINE_SYMBOL
  }

  scanNewLines (input: string) {
    this.current += input.split(NEW_LINE_SYMBOL).length - 1
  }
}

export default LineTracker

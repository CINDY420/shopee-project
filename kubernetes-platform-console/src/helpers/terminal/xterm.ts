import { Terminal, ITerminalOptions, IBuffer } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'

const XTERMINAL_DEFAULT_OPTIONS: ITerminalOptions = {
  scrollback: 1000,
  theme: {
    selection: '#fadc0bB0'
  }
}

const XTERMINAL_ADDONS = {
  fitAddon: FitAddon,
  searchAddon: SearchAddon
}

interface IProps {
  parent: HTMLElement
}

class XTerm extends Terminal {
  fitAddon: FitAddon
  searchAddon: SearchAddon
  disposeOnData: () => void

  constructor (props: IProps) {
    super(XTERMINAL_DEFAULT_OPTIONS)
    const { parent } = props
    this.create(parent)
  }

  create (parent: HTMLElement) {
    this.open(parent)
    this.loadAddons()
    this.initialize()
  }

  loadAddons () {
    for (const [addonName, Addon] of Object.entries(XTERMINAL_ADDONS)) {
      const addon = new Addon()
      this.loadAddon(addon)
      this[addonName] = addon
    }
  }

  initialize () {
    this.fitAddon.fit()
    this.focus()
    this.element.style.padding = '1em'
    this.element.style.width = '100%'
    this.element.style.height = '100%'
  }

  destory () {
    this.disposeOnData && this.disposeOnData()
    this.dispose()
  }
}

export default XTerm

/**
 * Get the content of xterm.js instance
 * @param xterm xterm instance
 * @returns string content
 */
export const getXTermContent = (buffer: IBuffer) => {
  let content = ''

  for (let i = 0; i < buffer.length; i++) {
    content += '\r\n' + buffer.getLine(i).translateToString(true)
  }

  return content
}

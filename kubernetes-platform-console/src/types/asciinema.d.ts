interface IAsciinema {
  player: {
    js: {
      CreatePlayer: any
      UnmountPlayer: any
    }
  }
}
export {}

declare global {
  interface Window {
    asciinema: IAsciinema
  }
  const asciinema: asciinema
}

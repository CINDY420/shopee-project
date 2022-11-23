import StateMachine from './StateMachine'

export enum KEY {
  PRESS_EVENT = 'pressKey',
  NOT_PRESS_EVENT = 'notPressKey'
}

enum STATE {
  KEY_NOT_PRESSED = 'keyNotPressed',
  KEY_PRESSED_ONCE = 'keyPressedOnce'
}

let pressKeyInterval: any

const clearPressKeyInterval = () => {
  if (pressKeyInterval) {
    clearTimeout(pressKeyInterval)
  }
}

const doublePressKeyHandler = doublePressedKeyCallback => {
  const doublePressStateMachine = new StateMachine({
    initialState: STATE.KEY_NOT_PRESSED,
    states: {
      [STATE.KEY_NOT_PRESSED]: {
        transitions: {
          [KEY.PRESS_EVENT]: {
            target: STATE.KEY_PRESSED_ONCE,
            action () {
              pressKeyInterval = setTimeout(() => {
                doublePressStateMachine.transition(KEY.NOT_PRESS_EVENT)
              }, 1000)
            }
          }
        }
      },
      [STATE.KEY_PRESSED_ONCE]: {
        transitions: {
          [KEY.PRESS_EVENT]: {
            target: STATE.KEY_NOT_PRESSED,
            action () {
              clearPressKeyInterval()
              doublePressedKeyCallback()
            }
          },
          [KEY.NOT_PRESS_EVENT]: {
            target: STATE.KEY_NOT_PRESSED,
            action () {
              clearPressKeyInterval()
            }
          }
        }
      }
    }
  })

  return doublePressStateMachine
}

export default doublePressKeyHandler

interface IEvent {
  target: string
  action: () => void
}

interface ITransitions {
  [key: string]: IEvent
}

interface IStates {
  [key: string]: ITransitions
}

interface IStateMachine {
  initialState: string
  states: IStates
}

class StateMachine {
  currentState: string
  states: IStateMachine

  constructor (definition) {
    this.currentState = definition.initialState
    this.states = definition.states
  }

  transition (event) {
    const currentState = this.currentState
    const currentStateDefinition = this.states[currentState]
    const destinationTransition = currentStateDefinition.transitions[event]

    if (!destinationTransition) {
      console.error('null transition event')
      return
    }

    if (destinationTransition.action) {
      destinationTransition.action()
    }

    const destinationState = destinationTransition.target

    this.currentState = destinationState
    return this.currentState
  }
}

export default StateMachine
// TODO: write test

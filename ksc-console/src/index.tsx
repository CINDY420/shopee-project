import ReactDOM from 'react-dom'
import App from './App'

// hard code to fix global undefined
;(window as any).global = window

ReactDOM.render(<App />, document.getElementById('root'))

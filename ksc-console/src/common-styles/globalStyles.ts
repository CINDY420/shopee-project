import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
  background-color: #f7f7f7;
  font-family: "Roboto";
}
#root {
  height: 100%;
}
.red-asterisk::before {
  display: inline-block;
  margin-right: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
`

export default GlobalStyle

import * as https from 'https'
import * as http from 'http'

// const MAX_SOCKETS = 20000

export const HTTPS_AGENT = new https.Agent({
  rejectUnauthorized: false
})

export const HTTP_AGENT = new http.Agent({})

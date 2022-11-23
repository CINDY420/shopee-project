import * as client from 'prom-client'

// Register a client
export const register = client.register

const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics()

// Request Counter
export const requestCounter = new client.Counter({
  name: 'ske_node_http_requests_total',
  help: 'Count all requests for ske node gateway',
  labelNames: ['statusCode']
})
// Loading duration Histogram
export const loadingDurationHistogram = new client.Histogram({
  name: 'ske_console_loading_duration_ms',
  help: 'Record the loading duration of ske console, in ms.',
  buckets: [0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
})

export const httpLatencyHistogram = new client.Histogram({
  name: 'ske_node_http_requests_latency',
  help: 'Record the latency of http requests according to resource',
  buckets: [50, 100, 200, 300, 500, 1000, 2000, 3000],
  labelNames: ['method', 'statusCode', 'resource']
})

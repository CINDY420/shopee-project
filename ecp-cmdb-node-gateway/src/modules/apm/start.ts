import elasticApm from 'elastic-apm-node'

const apm = {
  isStarted: (): boolean => elasticApm.isStarted(),
  start: (options?: elasticApm.AgentConfigOptions): elasticApm.Agent => elasticApm.start(options),
  middleware: elasticApm.middleware,
}
export { apm }

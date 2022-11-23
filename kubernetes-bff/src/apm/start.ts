import * as elasticApm from 'elastic-apm-node'

const apm = {
  isStarted: (): boolean => elasticApm.isStarted(),
  start: (options?): any => elasticApm.start(options),
  middleware: elasticApm.middleware
}
export { apm }

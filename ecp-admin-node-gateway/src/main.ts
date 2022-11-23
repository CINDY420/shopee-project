import { bootstrapPrometheusApp, startServer } from '@/bootstrap'
;(async () => {
  await startServer()
  await bootstrapPrometheusApp()
})()

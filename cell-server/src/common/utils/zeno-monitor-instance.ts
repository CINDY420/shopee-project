import { getZenoMonitor } from '@zeno/agent-monitor-nest'
export const zenoMonitorInstance = getZenoMonitor({
  counter: [
    {
      name: 'demo_request_times',
      help: 'request times',
    },
  ],
})

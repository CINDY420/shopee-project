export const LOG_PLATFORM_ENV_URL_MAP = {
  live: 'https://log.shopee.io/redirect-port',
  nonlive: 'https://log.test.shopee.io/redirect-port',
  test: 'https://devops-daemon.i.test.shopee.io/k8s/pipeline/logging-platform-samking/fe/redirect-port'
}
const MONITORING_PLATFORM_ENV_URL_MAP = {
  live: 'https://monitoring.infra.sz.shopee.io/grafana/d/YJPN5Cu7z/k8s-cluster-business',
  test: 'https://monitoring.infra.test.sz.shopee.io/grafana/d/IZZovnjMk/k8s-cluster-business' // no test grafana
}

export const TRACING_ENV_URL_MAP = {
  LIVE: 'https://jaeger.shopeemobile.com/trace',
  TEST: 'https://jaeger.test.shopeemobile.com/trace'
}

export const MonitoringPlatformUrl = MONITORING_PLATFORM_ENV_URL_MAP[__SERVER_ENV__]

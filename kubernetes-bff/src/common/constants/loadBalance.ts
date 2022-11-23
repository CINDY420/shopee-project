export enum LoadBalanceType {
  LIVE = 'live',
  NON_LIVE = 'nonlive'
}
export const cids = ['ID', 'VN', 'PH', 'TW', 'TH', 'MY', 'SG', 'BR', 'MX', 'XX', 'CN']
export const typeEnvsMap = {
  [LoadBalanceType.LIVE]: ['LIVEISH', 'LIVE'],
  [LoadBalanceType.NON_LIVE]: ['TEST', 'STAGING', 'UAT', 'STABLE']
}
export const typeClustersMap = {
  [LoadBalanceType.LIVE]: ['kube-general-ctl-live', 'kube-general-sg-live', 'kube-ds-sg3-live'],
  [LoadBalanceType.NON_LIVE]: ['kube-general-sg2-test']
}

export const frontendTemplate =
  'use_backend project-module-{{env}}-{{cid}}    if { hdr_dom(host) xxx.{{domain_env_flag}}shopee.{{domain_cid_suffix}} } { path_beg  /api }'
export const backendTemplate =
  'backend project-module-{{env}}-{{cid}} \n  default-server no-ssl resolvers local resolve-opts allow-dup-ip resolve-prefer ipv4 check\n  server-template server 10 _http._tcp.project-module-{{env}}-{{cid}}.project-{{env}}-{{cid}}.svc.{{kube_cluster}}'

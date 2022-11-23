import { parseGroupProjectFromPath, validateProjectQuotas } from '../project'

describe('parseGroupFromPath', () => {
  it('should parse group name from path', () => {
    const result = parseGroupProjectFromPath('/api/v3/groups/Infra Group')
    expect(result).toBe(null)
  })

  it('should parse group name from long path', () => {
    const result = parseGroupProjectFromPath('/api/v3/groups/Infra Group/projects/test')
    expect(result).toEqual(['Infra Group', 'test'])
  })

  it('should not parse group name from wrong path', () => {
    const result = parseGroupProjectFromPath('/api/v3/groupss/Infra Group/projects/test')
    expect(result).toEqual(null)
  })
})

describe('validateProjectQuotas', () => {
  // const updateData = {
  //   cids: ['MX', 'TW'],
  //   clusters: ['test'],
  //   environments: ['TEST', 'UAT', 'STAGING'],
  //   group: 'Infrastructure Team',
  //   project: 'wsw1212312321',
  //   relations: ['TEST-MX:test', 'UAT-MX:test', 'STAGING-MX:test'],
  //   updatetime: '2020-12-30T06:45:55Z',
  //   createtime: '2020-12-30T03:07:15Z',
  //   quotas: [
  //     { name: 'test:TEST', cpuTotal: 0.03, memoryTotal: 0.02 },
  //     { name: 'test:UAT', cpuTotal: 0.01, memoryTotal: 0.01 },
  //     { name: 'test:STAGING', cpuTotal: 0.02, memoryTotal: 0.02 }
  //   ]
  // }
  // const diffEsData = {
  //   group: 'Infrastructure Team',
  //   cids: ['MX'],
  //   clusters: ['test'],
  //   relations: ['TEST-MX:test', 'UAT-MX:test', 'STAGING-MX:test'],
  //   createtime: '2020-12-30T03:07:15Z',
  //   environments: ['TEST', 'UAT', 'STAGING'],
  //   project: 'wsw1212312321',
  //   updatetime: '2020-12-30T06:45:55.729Z'
  // }
  // const quotas = {
  //   group: 'Infrastructure Team',
  //   project: 'wsw1212312321',
  //   quotas:
  //     '{"Quotas":{"TEST-*:test":{"name":"TEST-*:test","cpuTotal":0.03,"memoryTotal":0.02},"UAT-*:test":{"name":"UAT-*:test","cpuTotal":0.01,"memoryTotal":0.01},"STAGING-*:test":{"name":"STAGING-*:test","cpuTotal":0.02,"memoryTotal":0.02}}}'
  // }
  // const diffQuotas = {
  //   group: 'Infrastructure Team',
  //   project: 'wsw1212312321',
  //   quotas:
  //     '{"Quotas":{"TEST-*:test":{"name":"TEST-*:test","cpuTotal":0.03,"memoryTotal":0.02},"UAT-*:test":{"name":"UAT-*:test","cpuTotal":0.01,"memoryTotal":0.01},"STAGING-*:test":{"name":"STAGING-*:test","cpuTotal":0.01,"memoryTotal":0.01}}}'
  // }
  // const diffRoundQuotas = {
  //   group: 'Infrastructure Team',
  //   project: 'wsw1212312321',
  //   quotas:
  //     '{"Quotas":{"TEST-*:test":{"name":"TEST-*:test","cpuTotal":0.03,"memoryTotal":0.02},"UAT-*:test":{"name":"UAT-*:test","cpuTotal":0.01,"memoryTotal":0.01},"STAGING-*:test":{"name":"STAGING-*:test","cpuTotal":0.019999999,"memoryTotal":0.019999999}}}'
  // }
  // it('Project message match', () => {
  //   const result = validateProjectQuotas(updateData, updateData, quotas)
  //   expect(result).toEqual(true)
  // })
  // it('Project message does not match', () => {
  //   const result = validateProjectQuotas(updateData, diffEsData, quotas)
  //   expect(result).toEqual(false)
  // })
  // it('Project quota does not match', () => {
  //   const result = validateProjectQuotas(updateData, updateData, diffQuotas)
  //   expect(result).toEqual(false)
  // })
  // it('Project quota with valid precision error', () => {
  //   const result = validateProjectQuotas(updateData, updateData, diffRoundQuotas)
  //   expect(result).toEqual(true)
  // })
})

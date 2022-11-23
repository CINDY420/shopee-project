import { filterHandler, parseFilters } from 'common/helpers/filter'

describe('Test Project List Data Paginate', () => {
  it('Test parseFilters', () => {
    const filters = parseFilters('cluster==szdevops-live,cluster==sg2-test;cid==TW')
    expect(filters).toStrictEqual([
      [
        { key: 'cluster', operator: '==', value: 'szdevops-live' },
        { key: 'cluster', operator: '==', value: 'sg2-test' }
      ],
      [{ key: 'cid', operator: '==', value: 'TW' }]
    ])
  })

  it('Test filterHandler', () => {
    const filters = parseFilters('cluster==szdevops-live,cluster==sg2-test;cid==TW')
    const result = filterHandler(filters, [
      {
        cids: ['SG', 'VN', 'ID', 'TH', 'MY', 'PH', 'TW', 'CN'],
        clusters: ['dev', 'szdevops-live', 'sg2-test', 'test'],
        envs: ['DEV', 'TEST', 'UAT', 'STAGING', 'LIVE', 'LIVEISH', 'STABLE', 'QA'],
        groupName: 'Infrastructure Team',
        name: 'qa'
      },
      {
        cids: ['SG', 'TW'],
        clusters: ['sg2-test'],
        envs: ['TEST'],
        groupName: 'Infrastructure Team',
        name: 'qafte'
      },
      {
        cids: ['SG', 'CN', 'TW'],
        clusters: ['test', 'dev', 'szdevops-live', 'sg2-test'],
        envs: ['DEV', 'TEST', 'UAT', 'STAGING', 'LIVE', 'LIVEISH'],
        groupName: 'Infrastructure Team',
        name: 'test-gxs'
      },
      {
        cids: ['SG', 'CN', 'BR', 'VN', 'ID', 'TH', 'MY', 'TW', 'PH'],
        clusters: ['test', 'dev', 'test-calico', 'szdevops-live'],
        envs: ['DEV', 'TEST', 'LIVEISH', 'UAT', 'QA', 'STAGING', 'SIT', 'LIVE'],
        groupName: 'Infrastructure Team',
        name: 'testddd'
      },
      {
        cids: ['CN'],
        clusters: ['test', 'szdevops-live', 'dev'],
        envs: ['TEST'],
        groupName: 'Infrastructure Team',
        name: 'zxl'
      }
    ])
    expect(result).toStrictEqual([
      {
        cids: ['SG', 'VN', 'ID', 'TH', 'MY', 'PH', 'TW', 'CN'],
        clusters: ['dev', 'szdevops-live', 'sg2-test', 'test'],
        envs: ['DEV', 'TEST', 'UAT', 'STAGING', 'LIVE', 'LIVEISH', 'STABLE', 'QA'],
        groupName: 'Infrastructure Team',
        name: 'qa'
      },
      {
        cids: ['SG', 'TW'],
        clusters: ['sg2-test'],
        envs: ['TEST'],
        groupName: 'Infrastructure Team',
        name: 'qafte'
      },
      {
        cids: ['SG', 'CN', 'TW'],
        clusters: ['test', 'dev', 'szdevops-live', 'sg2-test'],
        envs: ['DEV', 'TEST', 'UAT', 'STAGING', 'LIVE', 'LIVEISH'],
        groupName: 'Infrastructure Team',
        name: 'test-gxs'
      },
      {
        cids: ['SG', 'CN', 'BR', 'VN', 'ID', 'TH', 'MY', 'TW', 'PH'],
        clusters: ['test', 'dev', 'test-calico', 'szdevops-live'],
        envs: ['DEV', 'TEST', 'LIVEISH', 'UAT', 'QA', 'STAGING', 'SIT', 'LIVE'],
        groupName: 'Infrastructure Team',
        name: 'testddd'
      }
    ])
  })
})

import { makeApplicationInstanceName } from '../applicationInstance'

describe('makeApplicationInstanceName', () => {
  it('should make applicationInstance name with fte', () => {
    const options = {
      clusterName: 'test',
      appName: 'app1',
      env: 'live',
      cid: 'vn',
      fte: 'fte'
    }
    const applicationInstanceName = makeApplicationInstanceName(options)
    expect(applicationInstanceName).toBe(
      `${options.appName}-${options.clusterName}-${options.env}-${options.cid}-${options.fte}`
    )
  })

  it('should make application without fte', () => {
    const options = {
      clusterName: 'test',
      appName: 'app1',
      env: 'live',
      cid: 'vn'
    }
    const applicationInstanceName = makeApplicationInstanceName(options)
    expect(applicationInstanceName).toBe(`${options.appName}-${options.clusterName}-${options.env}-${options.cid}`)
  })
})

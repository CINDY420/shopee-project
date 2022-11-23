import { METHODS } from 'common/interfaces/jest.interface'

describe('AppController (e2e)', () => {
  const request = (global as any).request

  it('level=p1 resource=app: should successfully access nest app', async () => {
    return request({ url: '/', method: METHODS.GET }).expect(200).expect('Hello World!')
  })
})

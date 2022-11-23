import { parseGroupFromPath } from '../group'

describe('parseGroupFromPath', () => {
  it('should parse group name from path', () => {
    const group = parseGroupFromPath('/api/v3/groups/Infra Group')
    expect(group).toBe('Infra Group')
  })

  it('should parse group name from long path', () => {
    const group = parseGroupFromPath('/api/v3/groups/Infra Group/projects/test')
    expect(group).toBe('Infra Group')
  })

  it('should not parse group name from wrong path', () => {
    const group = parseGroupFromPath('/api/v3/tests/Infra Group/projects/test')
    expect(group).toBe(null)
  })
})

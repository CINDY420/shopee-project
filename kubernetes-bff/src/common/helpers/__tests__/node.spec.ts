import { LABEL_ROLE_KEY, ROLES } from 'common/constants/node'
import { getRoleFromLabel } from '../node'

describe('getRoleFromLabel', () => {
  it('should parse unspecified role', () => {
    const role = getRoleFromLabel('abc')
    expect(role).toBe(ROLES.UNSPECIFIED)
  })

  it('should parse unspecified role when key is not role_key', () => {
    const role = getRoleFromLabel(`abc/${ROLES.MASTER}`)
    expect(role).toBe(ROLES.UNSPECIFIED)
  })

  it('should parse master role', () => {
    const role = getRoleFromLabel(`${LABEL_ROLE_KEY}/${ROLES.MASTER}`)
    expect(role).toBe(ROLES.MASTER)
  })

  it('should parse worker role', () => {
    const role = getRoleFromLabel(`${LABEL_ROLE_KEY}/${ROLES.WORKER}`)
    expect(role).toBe(ROLES.WORKER)
  })
})

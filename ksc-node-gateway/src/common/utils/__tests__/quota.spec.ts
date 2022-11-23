import { convertK8sMemoryQuotaToNumber } from '@/common/utils/quota'
import { MEMORY_UNIT } from '@/common/constants/quota'

describe('test convertK8sMemoryQuotaToNumber()', () => {
  it('5Gi equal 5Gi', () => {
    expect(convertK8sMemoryQuotaToNumber('5Gi', MEMORY_UNIT.GI)).toBe(5)
  })
  it('5Mi equal 5Mi', () => {
    expect(convertK8sMemoryQuotaToNumber('5Mi', MEMORY_UNIT.MI)).toBe(5)
  })
  it('5Ki equal 5Ki', () => {
    expect(convertK8sMemoryQuotaToNumber('5Ki', MEMORY_UNIT.KI)).toBe(5)
  })

  it('5Gi equal 5 * 1024 Mi', () => {
    expect(convertK8sMemoryQuotaToNumber('5Gi', MEMORY_UNIT.MI)).toBe(5 * 1024)
  })
  it('5Mi equal 5 * 1024 Ki', () => {
    expect(convertK8sMemoryQuotaToNumber('5Mi', MEMORY_UNIT.KI)).toBe(5 * 1024)
  })

  it('3000Mi equal 3000 / 1024 Gi', () => {
    expect(convertK8sMemoryQuotaToNumber('3000Mi', MEMORY_UNIT.GI)).toBe(3000 / 1024)
  })
  it('3000Ki equal 3000 / 1024 Mi', () => {
    expect(convertK8sMemoryQuotaToNumber('3000Ki', MEMORY_UNIT.MI)).toBe(3000 / 1024)
  })

  it('3000000Ki equal 3000 / 1024 ** 2 Gi', () => {
    expect(convertK8sMemoryQuotaToNumber('3000Ki', MEMORY_UNIT.GI)).toBe(3000 / 1024 ** 2)
  })
})

import { roundToTwo } from 'common/helpers/decimal'

describe('roundToTwo', () => {
  const tests = [
    ['should integer number not change', 1, 1],
    ['should float number keep at most two decimal', 1.52, 1.52],
    ['should float number rounded case 1', 2.54999999, 2.55],
    ['should float number rounded case 2', 0.00000001, 0],
    ['should number string convert to number', '0.00000001', 0]
  ]

  tests.map((t) =>
    it(`${t[0]} (${t[1]} to ${t[2]})`, () => {
      expect(roundToTwo(t[1] as any)).toEqual(t[2])
    })
  )
})

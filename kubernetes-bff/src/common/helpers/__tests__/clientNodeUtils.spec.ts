import { cpuQuantityScalar, memoryQuantityScalar, unitMultipliers } from 'common/helpers/clientNodeUtils'

describe('cpuQuantityScalar', () => {
  // pattern is [description, input, output]
  const tests = [
    ['should parses full numbers', '1', 1],
    ['should parses floats (< 1)', '1.5', 1.5],
    ['should parses floats (> 1)', '0.5', 0.5],
    ['should parses strings with milli (m) unit (whole number)', '1000m', 1],
    ['should parses strings with milli (m) unit (decimal number)', '1300m', 1.3],
    ['should parses strings with milli (m) unit (< 1)', '300m', 0.3],
    ['should parses strings with (u) unit (< 1)', '300u', 0.0003]
  ]

  tests.map((t) =>
    it(`${t[0]} (${t[1]} to ${t[2]})`, () => {
      expect(cpuQuantityScalar(t[1] as string)).toEqual(t[2])
    })
  )
})

describe('memoryQuantityScalar', () => {
  // pattern is [description, input, output]
  const tests = [
    ['should parses thousandth of full number', '1000m', 1 / unitMultipliers.Gi],
    ['should parses full numbers', '1', 1 / unitMultipliers.Gi],
    ['should parses kilo strings', '1k', (1 * 1000 ** 1) / unitMultipliers.Gi],
    ['should parses Mega strings', '2M', (2 * 1000 ** 2) / unitMultipliers.Gi],
    ['should parses Giga strings', '3G', (3 * 1000 ** 3) / unitMultipliers.Gi],
    ['should parses Tera strings', '4T', (4 * 1000 ** 4) / unitMultipliers.Gi],
    ['should parses Peta strings', '5P', (5 * 1000 ** 5) / unitMultipliers.Gi],
    ['should parses Exa strings', '6E', (6 * 1000 ** 6) / unitMultipliers.Gi],
    ['should parses kibi strings', '1Ki', (1 * 1024 ** 1) / unitMultipliers.Gi],
    ['should parses Mebi strings', '2Mi', (2 * 1024 ** 2) / unitMultipliers.Gi],
    ['should parses Gibi strings', '3Gi', (3 * 1024 ** 3) / unitMultipliers.Gi],
    ['should parses Tebi strings', '4Ti', (4 * 1024 ** 4) / unitMultipliers.Gi],
    ['should parses Pebi strings', '5Pi', (5 * 1024 ** 5) / unitMultipliers.Gi],
    ['should parses Exbi strings', '6Ei', (6 * 1024 ** 6) / unitMultipliers.Gi]
  ]

  tests.map((t) =>
    it(`${t[0]} (${t[1]} to ${t[2]})`, () => {
      expect(memoryQuantityScalar(t[1] as string)).toEqual(t[2])
    })
  )
})

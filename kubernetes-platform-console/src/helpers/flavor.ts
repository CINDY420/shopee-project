import { IClusterFlavor } from 'api/types/cluster/cluster'

const CPU_UNIT = ' Cores'
const MEMORY_UNIT = ' GiB'
const SPLIT = ' / '

/**
 * @arg: { cpu: 1, memory: 2 }
 * @return: '1 Cores / 2 GiB']]
 */
export const transformFlavorToSelectOption = (flavor: IClusterFlavor): string => {
  const { cpu, memory } = flavor || {}
  return cpu !== undefined && memory !== undefined
    ? `${flavor.cpu}${CPU_UNIT}${SPLIT}${flavor.memory}${MEMORY_UNIT}`
    : '-'
}
export const transformFlavorsToSelectOptions = (flavors: IClusterFlavor[]): string[] => {
  return flavors.map(flavor => transformFlavorToSelectOption(flavor))
}

/**
 * @arg: '1 Cores / 2 GiB'
 * @return:  { cpu: 1, memory: 2 }
 */
export const parseSelectOptionToFlavor = (selectOption: string): IClusterFlavor => {
  if (!selectOption) return undefined
  // example: ['1 Cores', '2 GiB']
  const [cpuOption, memoryOption] = selectOption.split(SPLIT)
  const [cpuString] = cpuOption.split(CPU_UNIT)
  const [memoryString] = memoryOption.split(MEMORY_UNIT)
  return { cpu: Number(cpuString), memory: Number(memoryString) }
}

export const parseSelectOptionsToFlavors = (selectOptions: string[]): IClusterFlavor[] => {
  return selectOptions.map(option => parseSelectOptionToFlavor(option))
}

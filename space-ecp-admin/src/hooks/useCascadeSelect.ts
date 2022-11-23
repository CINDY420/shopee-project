import { useEffect, useState } from 'react'
import type useForm from 'infrad/lib/form/hooks/useForm'
import type { SelectProps } from 'rc-select/lib/Select'

export interface IOptionData {
  value: string | number
  label: string
}
type FetchNextOptionFn<T> = (currentValue: string, selectedValues: string[]) => T | Promise<T>
interface IUseCascadeSearchConfig<T = IOptionData[]> {
  fetchNextOptionFns: FetchNextOptionFn<T>[]
}

const useCascadeSearch = <T = IOptionData[]>({
  fetchNextOptionFns = [],
}: IUseCascadeSearchConfig<T>) => {
  const [responseDataList, setResponseDataList] = useState<T[]>([])
  const [loadingList, setLoadingList] = useState(fetchNextOptionFns.map(() => false))
  const [currentIndex, setCurrentIndex] = useState(0)

  /**
   * search the ${index} select option
   * @param index
   * @param currentValue
   * @param selectedValues
   */
  const search = (index: number, currentValue: string, selectedValues: string[]) => {
    if (index >= fetchNextOptionFns.length || index < 0) {
      return
    }
    if (index > 0 && !responseDataList[index - 1]) {
      return
    }

    setCurrentIndex(index)

    // save old data before ${index}
    const array = [...responseDataList.slice(0, index)]
    setResponseDataList(array)
    const loading = [...loadingList]
    loading[index] = true
    setLoadingList(loading)

    // warp fetchNextOptionFn to promise
    void Promise.resolve(fetchNextOptionFns[index](currentValue, selectedValues)).then((value) => {
      const nextArray = [...responseDataList.slice(0, index + 1)]
      nextArray[index] = value
      const nextLoading = [...loadingList]
      nextLoading[index] = false
      setLoadingList(nextLoading)
      setResponseDataList(nextArray)
    })
  }

  const reset = () => {
    setResponseDataList([])
    setLoadingList(fetchNextOptionFns.map(() => false))
    setCurrentIndex(0)
    search(0, '', [])
  }

  return {
    search,
    responseDataList,
    loadingList,
    setResponseDataList,
    currentIndex,
    reset,
  }
}

export interface IListItem<T = IOptionData[]> {
  name: string
  defaultSelectValue?: string
  fetchNextOptionFn: FetchNextOptionFn<T>
  enableSearch?: boolean
}

interface ISelect {
  props: {
    loading: boolean
    onChange: SelectProps['onChange']
    disabled?: boolean
    showSearch?: boolean
    filterOption?: SelectProps['filterOption']
    optionFilterProp?: SelectProps['optionFilterProp']
  }
  options: IOptionData[]
}

interface IUseCascadeSelectConfig {
  list: IListItem[]
  form?: ReturnType<typeof useForm>[0]
}

export const useCascadeSelect = ({ list = [], form }: IUseCascadeSelectConfig) => {
  const { search, responseDataList, loadingList, setResponseDataList, currentIndex, reset } =
    useCascadeSearch<IOptionData[]>({
      fetchNextOptionFns: list.map((list) => list.fetchNextOptionFn),
    })

  const selects: ISelect[] = list.map((item, index) => {
    const options = responseDataList[index] || []

    return {
      props: {
        loading: loadingList[index],
        disabled: currentIndex < index,
        showSearch: list[index].enableSearch,
        filterOption: list[index].enableSearch,
        optionFilterProp: 'children',
        onChange(value: string) {
          const selectedValues: string[] = []
          if (form) {
            for (let i = 0; i <= index; i += 1) {
              selectedValues.push(form.getFieldValue(list[i].name) as string)
            }
          }

          if (value) {
            search(index + 1, value, selectedValues)
          }

          if (form) {
            const values: Record<string, string | undefined> = {}
            for (let i = index + 1; i < list.length; i += 1) {
              values[list[i].name] = currentIndex + 1 === i ? list[i].defaultSelectValue : undefined
            }
            const nextResponseDataList = responseDataList.slice(0, index + 1)
            form.setFieldsValue(values)
            setResponseDataList(nextResponseDataList)
          }
        },
      },
      options,
    }
  })

  useEffect(() => {
    if (!responseDataList[0]) {
      search(0, '', [])
    }
  }, [])

  return {
    search,
    selects,
    reset,
  }
}

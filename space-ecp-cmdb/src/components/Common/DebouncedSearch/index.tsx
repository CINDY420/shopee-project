import { functionUtils } from '@space/common-utils'
import { Input } from 'infrad'
import * as React from 'react'
import { SearchProps } from 'infrad/lib/input'

const { debounce } = functionUtils
const { Search } = Input

interface IProps extends SearchProps {
  defaultValue?: string
  placeholder?: string
  debounceTime?: number
  callback: (value: string) => void
  style?: React.CSSProperties
}

export default function DebouncedSearch({
  defaultValue,
  placeholder = 'Search',
  debounceTime = 0,
  callback,
  style = { borderRadius: '50%', width: 240, marginBottom: 10 },
  ...searchProps
}: IProps): JSX.Element {
  const debouncedCallback = debounce(
    debounceTime,
    (searchKey: string) => {
      callback(searchKey)
    },
    false,
  )

  return (
    <Search
      style={style}
      onChange={(e) => debouncedCallback(e.target.value)}
      placeholder={placeholder}
      allowClear
      defaultValue={defaultValue}
      {...searchProps}
    />
  )
}

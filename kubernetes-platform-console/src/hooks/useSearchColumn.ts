import { useRef } from 'react'
import ColumnSearch from 'helpers/table/columnSearch'

/**
 * React hook for table column search configs
 * @param columnName the key of target search column in table
 * @param isDefaultConfigs [true] for use default configs to build columnSearchConfig, with all configs
 *                         [false] for use simple configs to build columnSearchConfig(without onFilter && onFilterDropdownVisibleChange)
 * @return an array with an object, the object has all column search configs
 */
const useSearchColumn = (columnName: string) => {
  const search = useRef(new ColumnSearch(columnName))

  search.current.buildDefaultColumnSearchConfig()

  const searchColumn = search.current

  return [searchColumn]
}

export default useSearchColumn

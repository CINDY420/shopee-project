import * as React from 'react'
import { SearchOutlined } from 'infra-design-icons'
import Highlighter from 'react-highlight-words'
import FilterDropdown from 'helpers/table/FilterDropdown'

/**
 * Class to build table column search configs
 */
class ColumnSearch {
  searchText
  columnSearchConfig
  dataIndex
  searchInput

  /**
   * Create an empty column search config
   * @param dataIndex the key of target search column in table
   */
  constructor(dataIndex) {
    this.searchText = ''
    this.columnSearchConfig = {}
    this.dataIndex = dataIndex
  }

  /**
   * Use default configs to build a column search config
   * Default configs : [filterDropdown, filterIcon, onFilter, onFilterDropdownVisibleChange]
   */
  buildDefaultColumnSearchConfig() {
    this.buildFilterDropdown()
    this.buildFilterIcon()
  }

  /**
   * Build filterDropdown search config
   */
  buildFilterDropdown() {
    this.columnSearchConfig.filterDropdown = ({
      setSelectedKeys,
      selectedKeys,
      confirm: filterConfirm,
      clearFilters
    }) => {
      this.searchText = selectedKeys[0]
      return (
        <FilterDropdown
          inputRef={node => {
            this.searchInput = node
          }}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => {
            filterConfirm()
          }}
          onReset={() => {
            clearFilters()
          }}
        />
      )
    }
  }

  /**
   * Build filterIcon search config
   */
  buildFilterIcon() {
    this.columnSearchConfig.filterIcon = (filtered: boolean) => (
      <SearchOutlined type='search' style={{ color: filtered ? '#1890ff' : undefined }} />
    )
  }

  /**
   * Get table render config with search text highlight
   * @param text the data in table column
   * @return {jsx} DOM with search text highlight
   */
  getRenderContent(text) {
    return (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  }
}

export default ColumnSearch

You can use this box to get the search filter of table columns.

```jsx
const [value, setValue] = React.useState('')

const setSelectedKeys = (e) => {
  setValue(e.target.value)
}

const filterConfirm = () => {
  alert('Confirmed')
}

const clearFilters = () => {
  setValue('')
}

<FilterDropdown
  value={value}
  onChange={e => setSelectedKeys(e)}
  onSearch={() => {
    filterConfirm()
  }}
  onReset={() => {
    clearFilters()
  }}
/>

```

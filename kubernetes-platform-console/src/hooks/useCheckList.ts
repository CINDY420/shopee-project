import * as React from 'react'

type checkList = {
  checkedList: string[]
  checkAll: boolean
  handleListSelect: (any) => void
  handleListSelectAll: (any) => void
}
const useCheckList = (form: any, key: string, list: string[], defaultList: string[]): checkList => {
  const [checkedList, setCheckedList] = React.useState(defaultList)
  const [checkAll, setCheckAll] = React.useState(list.length === defaultList.length)

  const handleListSelect = e => {
    setCheckedList(e)
    setCheckAll(e.length === list.length)
    form.setFieldsValue({ [key]: e })
  }

  const handleListSelectAll = e => {
    setCheckedList(e.target.checked ? list : [])
    setCheckAll(e.target.checked)
    form.setFieldsValue({ [key]: e.target.checked ? list : [] })
  }
  return { checkedList, checkAll, handleListSelect, handleListSelectAll }
}

export default useCheckList

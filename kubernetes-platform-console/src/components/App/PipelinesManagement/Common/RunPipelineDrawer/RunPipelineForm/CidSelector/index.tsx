import React from 'react'
import { Checkbox } from 'infrad'
import useCheckList from 'hooks/useCheckList'

interface ICIDs {
  form: any
  cids: string[]
  defaultCids: string[]
}
const key = 'DEPLOY_CIDS'
const CidSelector: React.FC<ICIDs> = ({ form, cids, defaultCids }) => {
  const { checkedList, checkAll, handleListSelect, handleListSelectAll } = useCheckList(form, key, cids, defaultCids)
  return (
    <>
      <Checkbox onChange={handleListSelectAll} checked={checkAll}>
        All
      </Checkbox>
      <Checkbox.Group options={cids} value={checkedList} onChange={handleListSelect} />
    </>
  )
}

export default CidSelector

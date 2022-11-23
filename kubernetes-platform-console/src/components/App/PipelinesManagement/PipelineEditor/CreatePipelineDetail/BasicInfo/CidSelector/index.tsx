import React from 'react'
import { Checkbox } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
interface ICids {
  form: FormInstance
  defaultCids: string[]
  cids: string[]
}

const CidSelector: React.FC<ICids> = ({ form, defaultCids, cids }) => {
  const [checkedList, setCheckedList] = React.useState(defaultCids)
  const [checkAll, setCheckAll] = React.useState(false)

  React.useEffect(() => {
    setCheckedList(defaultCids)
    setCheckAll(defaultCids.length === cids.length)
  }, [cids.length, defaultCids])

  const handleCIDAutofill = (cidString: string) => {
    const fields = form.getFieldsValue()
    const { parameters } = fields
    const newParameters = parameters.map(each => {
      return each.key === 'DEPLOY_CIDS' ? { ...each, value: cidString } : each
    })
    form.setFieldsValue({ parameters: newParameters })
  }

  const handleCIDSelect = e => {
    setCheckedList(e)
    setCheckAll(e.length === cids.length)
    const cidString = e.join(',')
    handleCIDAutofill(cidString)
  }

  const handleCIDSelectAll = e => {
    setCheckedList(e.target.checked ? cids : [])
    setCheckAll(e.target.checked)
    const cidString = e.target.checked ? cids.join(',') : ''
    handleCIDAutofill(cidString)
  }
  return (
    <>
      <Checkbox onChange={handleCIDSelectAll} checked={checkAll}>
        All
      </Checkbox>
      <Checkbox.Group options={cids} value={checkedList} onChange={handleCIDSelect} style={{ display: 'contents' }} />
    </>
  )
}

export default CidSelector

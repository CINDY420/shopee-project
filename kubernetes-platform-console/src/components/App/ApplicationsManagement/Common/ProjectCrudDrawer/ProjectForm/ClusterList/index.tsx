import * as React from 'react'
import { Checkbox } from 'infrad'
import { FormProps } from 'infrad/lib/form'

import ClusterTable from './ClusterTable'

interface IQuotasMap {
  [key: string]: string[]
}

interface IProps extends FormProps {
  clusterList: any
  allQuotasNamesMap: IQuotasMap
  preSelectedQuotaNamesMap: IQuotasMap
  onChange?: (values: object) => void
}

const ClusterList: React.FC<IProps> = ({
  clusterList,
  preSelectedQuotaNamesMap,
  allQuotasNamesMap,
  onChange,
  form
}) => {
  const quotasMap = form.getFieldValue('quotas')
  const handleClusterChange = (checked, clusterName) => {
    const newResourceMap = { ...quotasMap }

    if (checked) {
      newResourceMap[clusterName] = allQuotasNamesMap[clusterName]
    } else {
      const selectedNames = newResourceMap[clusterName] || []
      const preSelectedNames = preSelectedQuotaNamesMap[clusterName] || []
      // 去掉勾选时重置错误信息
      selectedNames.forEach(name => !preSelectedNames.includes(name) && resetFiledError(clusterName, name))
      newResourceMap[clusterName] = preSelectedNames
    }

    onChange && onChange(newResourceMap)
  }

  const handleResourceChange = (clusterName, resourceName, checked) => {
    const newKeys = quotasMap[clusterName] ? [...quotasMap[clusterName]] : []

    if (checked) {
      newKeys.push(resourceName)
    } else {
      // 去掉勾选时重置错误信息
      resetFiledError(clusterName, resourceName)
      newKeys.splice(newKeys.indexOf(resourceName), 1)
    }

    const newResourceMap = {
      ...quotasMap,
      [clusterName]: newKeys
    }

    onChange && onChange(newResourceMap)
  }

  const resetFiledError = (clusterName: string, resourceName: string) => {
    const namePrefix = `${clusterName}---${resourceName}---`
    form.setFields([
      {
        name: `${namePrefix}cpu`,
        errors: []
      },
      {
        name: `${namePrefix}memory`,
        errors: []
      }
    ])
  }

  return clusterList.map(({ name, resourceQuotas }) => {
    const preSelectedResourceQuotaNames = preSelectedQuotaNamesMap[name] || []
    const selectedRowKeys = quotasMap[name] || []
    const isSelectAll = resourceQuotas.length === selectedRowKeys.length && selectedRowKeys.length !== 0
    const disabled = resourceQuotas.length === preSelectedResourceQuotaNames.length

    return (
      <div style={{ marginBottom: '24px' }} key={name}>
        <Checkbox
          checked={isSelectAll || disabled}
          disabled={disabled}
          onChange={e => handleClusterChange(e.target.checked, name)}
        >
          {name}
        </Checkbox>
        <ClusterTable
          selectedRowKeys={selectedRowKeys}
          preSelectedResourceQuotaNames={preSelectedResourceQuotaNames}
          resourceQuotas={resourceQuotas}
          onResourceChange={handleResourceChange}
          clusterName={name}
          form={form}
        />
      </div>
    )
  })
}

export default ClusterList

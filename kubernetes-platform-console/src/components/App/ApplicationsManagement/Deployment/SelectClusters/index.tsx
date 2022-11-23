import * as React from 'react'

import { SelectWrapper, StyledSelect } from './style'

const generateSelectOptions = (values: string[]) => {
  return values.map(value => ({
    label: value,
    value
  }))
}

interface ISelectClustersProps {
  clusters: string[]
  selectedCluster: string
}

const SelectClusters: React.FC<ISelectClustersProps> = ({ clusters, selectedCluster }) => {
  return (
    <SelectWrapper>
      <span>Cluster</span>
      {/* 后端返回的cluster列表不好处理，跟产品讨论，去掉cluster切换功能 */}
      <StyledSelect
        options={generateSelectOptions(clusters)}
        value={selectedCluster}
        getPopupContainer={() => document.body}
        disabled
      />
    </SelectWrapper>
  )
}

export default SelectClusters

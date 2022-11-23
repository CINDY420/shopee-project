import { FunctionComponent } from 'react'
import {
  FlexSpace,
  StyledFormItem,
} from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import { FormInstance, Select } from 'infrad'
import { IListItem, useCascadeSelect } from 'src/hooks/useCascadeSelect'
import { fetch } from 'src/rapper'
import { FilterByBuilder } from 'src/helpers/filterByBuilder'

const cascadeSelectList: IListItem[] = [
  {
    name: 'azSegment',
    fetchNextOptionFn: async () => {
      const { items } = await fetch['GET/ecpadmin/azSegments']()
      return items.map((item) => ({
        label: item.name ?? '',
        value: `${item.azKey}-${item.segmentKey}`,
      }))
    },
    enableSearch: true,
  },
  {
    name: 'cluster',
    fetchNextOptionFn: async (azSegment) => {
      const [azKey, segmentKey] = azSegment.split('-')
      const { items } = await fetch['GET/ecpadmin/clusters/metas']({
        pageNum: '1',
        pageSize: '99999',
        filterBy: new FilterByBuilder()
          .appendAndEq({
            cluster_type: 'cis',
            az_for_depconf: azKey,
            segment_key: segmentKey,
          })
          .build(),
      })
      return items.map((item) => ({
        label: item.displayName ?? '',
        value: item.uuid ?? '',
      }))
    },
    enableSearch: true,
  },
]

type AzSegmentBindClusterSelectorProp = {
  form: FormInstance
  name: number
}
export const AzSegmentBindClusterSelector: FunctionComponent<AzSegmentBindClusterSelectorProp> = (
  props,
) => {
  const { form, name } = props
  const { selects } = useCascadeSelect({
    form,
    list: cascadeSelectList,
  })
  const [azSegmentsSelect, clustersSelect] = selects

  return (
    <FlexSpace size={8}>
      <StyledFormItem
        $width="240px"
        name={[name, 'azSegment']}
        rules={[{ required: true, message: 'please select AZ-Segment' }]}
      >
        <Select
          {...azSegmentsSelect.props}
          placeholder="Select"
          getPopupContainer={() => document.body}
        >
          {azSegmentsSelect.options.map((option) => (
            <Select.Option key={option.label} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </StyledFormItem>
      <StyledFormItem
        $width="240px"
        name={[name, 'cluster']}
        rules={[{ required: true, message: 'please select Cluster' }]}
      >
        <Select
          {...clustersSelect.props}
          getPopupContainer={() => document.body}
          placeholder="Select"
        >
          {clustersSelect.options.map((option) => (
            <Select.Option key={option.label} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </StyledFormItem>
    </FlexSpace>
  )
}

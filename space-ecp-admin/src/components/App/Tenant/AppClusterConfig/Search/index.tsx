import { FunctionComponent, useState } from 'react'
import { Button, Col, Form, Row, Select, Spin } from 'infrad'
import {
  StyledFormItem,
  StyledSpace,
  StyledForm,
} from 'src/components/App/Tenant/AppClusterConfig/Search/style'
import { StyledSearchResult } from 'src/components/App/Tenant/AppClusterConfig/Search/SearchResult/style'
import { IListItem, useCascadeSelect } from 'src/hooks/useCascadeSelect'
import { fetch, useFetch } from 'src/rapper'
import {
  AppClusterConfigSearch,
  IAppClusterConfigSearchForm,
} from 'src/components/App/Tenant/AppClusterConfig/AppClusterConfigSearch'

export type ClusterResult = {
  scope: string
  clusters: {
    name: string
    id: string
  }[]
}

const cascadeSelectList: IListItem[] = [
  {
    name: 'tenant',
    fetchNextOptionFn: async () => {
      const { items } = await fetch['GET/ecpadmin/tenants']()
      return items.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    },
    enableSearch: true,
  },
  {
    name: 'project',
    fetchNextOptionFn: async (tenantId) => {
      const { items } = await fetch['GET/ecpadmin/projects']({ tenantId })
      return items.map((item) => ({
        label: item,
        value: item,
      }))
    },
    enableSearch: true,
  },
  {
    name: 'application',
    fetchNextOptionFn: async (projectId) => {
      const { items } = await fetch['GET/ecpadmin/applications']({
        id: projectId,
        scope: 'project',
      })
      return items.map((item) => ({
        label: item,
        value: item,
      }))
    },
    enableSearch: true,
  },
  {
    name: 'cid',
    fetchNextOptionFn: async () => {
      const { items } = await fetch['GET/ecpadmin/cids']()
      return items.map((item) => ({
        label: item.name,
        value: item.name,
      }))
    },
    enableSearch: false,
  },
]

type SearchProp = {
  className?: string
}
export const Search: FunctionComponent<SearchProp> = (props) => {
  const { className } = props

  const [form] = Form.useForm<IAppClusterConfigSearchForm>()
  const [results, setResults] = useState<ClusterResult[]>([])
  const [loading, setLoading] = useState(false)
  const { selects, reset: resetCascadeSelectOptions } = useCascadeSelect({
    form,
    list: cascadeSelectList,
  })
  const [tenant, project, application, cid] = selects

  const { data: fetchEnvData } = useFetch('GET/ecpadmin/envs')
  const optionsForEnv = (fetchEnvData?.items ?? []).map((item) => ({
    value: item.name,
    label: item.name,
  }))
  const { data: fetchAzSegmentsData } = useFetch('GET/ecpadmin/azSegments')
  const optionsForAzSegment = (fetchAzSegmentsData?.items ?? []).map((item) => ({
    value: `${item.azKey}-${item.segmentKey}`,
    label: item.name,
  }))

  const handleResetForm = () => {
    form.resetFields()
    resetCascadeSelectOptions()
    setResults([])
  }

  return (
    <>
      <StyledForm
        form={form}
        className={className}
        name="Search"
        onFinish={async (values) => {
          setLoading(true)
          const appClusterConfigSearch = new AppClusterConfigSearch(values)
          const results = await appClusterConfigSearch.getClusters()
          setResults(results)
          setLoading(false)
        }}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={8}>
            <StyledFormItem
              label="Tenant"
              name="tenant"
              required
              rules={[
                {
                  required: true,
                  message: 'Please select tenant!',
                },
              ]}
            >
              <Select {...tenant.props} placeholder="Select">
                {tenant.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>

          <Col span={8}>
            <StyledFormItem label="Project" name="project">
              <Select {...project.props} placeholder="Select">
                {project.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>

          <Col span={8}>
            <StyledFormItem label="Application" name="application">
              <Select {...application.props} placeholder="Select">
                {application.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={4}>
            <StyledFormItem label="CID" name="cid">
              <Select {...cid.props} placeholder="Select">
                {cid.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>

          <Col span={4}>
            <StyledFormItem label="ENV" name="env" initialValue="">
              <Select placeholder="Select">
                {optionsForEnv.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>

          <Col span={8}>
            <StyledFormItem label="AZ-Segment" name="azSegment" initialValue="">
              <Select placeholder="Select" showSearch optionFilterProp="children">
                {optionsForAzSegment.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </StyledFormItem>
          </Col>

          <Col span={8}>
            <StyledSpace>
              <StyledFormItem $isFontBold>
                <Button onClick={handleResetForm}>Reset</Button>
              </StyledFormItem>

              <StyledFormItem $isFontBold>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </StyledFormItem>
            </StyledSpace>
          </Col>
        </Row>
      </StyledForm>

      <Spin spinning={loading}>
        <StyledSearchResult resultItems={results} />
      </Spin>
    </>
  )
}

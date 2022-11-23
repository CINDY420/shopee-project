import * as React from 'react'
import { ContentWrapper, StyledInput, StyledButton } from 'components/App/TenantManagement/style'
import { message, Row, Col, Typography, Space, Empty, Form } from 'infrad'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { SearchOutlined, IFilter } from 'infra-design-icons'
import { Table } from 'common-styles/table'
import CrudModal from 'components/Common/CrudModal'
import ModalContent from 'components/App/TenantManagement/ModalContent'
import DetailLayout from 'components/Common/DetailLayout'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import {
  IListTenantsResponse,
  ITenantListItem,
  IDisplayQuota,
  IProductLine,
} from 'swagger-api/models'
import useAntdTable from 'hooks/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { ColumnsType } from 'infrad/lib/table'
import { useDebounce } from 'react-use'
import {
  tenantControllerCreateTenant,
  tenantControllerListTenants,
  ITenantControllerListTenantsParams,
  tenantControllerUpdateTenant,
} from 'swagger-api/apis/Tenant'
import { globalControllerListJobs } from 'swagger-api/apis/Global'

const { Text } = Typography

export enum MODAL_TYPE {
  CREATE_MODAL = 'Create Tenant',
  EDIT_MODAL = 'Edit Tenant',
}
interface IQuotaProps {
  value: number | string
  unit: string
}

const Quota = ({ value, unit }: IQuotaProps) => (
  <>
    <Text>{value}</Text>
    <HorizontalDivider size="4px" />
    <Text type="secondary" style={{ fontSize: '12px' }}>
      {unit}
    </Text>
  </>
)

const TenantManagement: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState<string>()
  const [selectedModalType, setSelectedModalType] = React.useState<MODAL_TYPE | undefined>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)
  const [tenantItem, setTenantItem] = React.useState<ITenantListItem>()
  const [selectTenantId, setSelectTenantId] = React.useState('')

  const [productLines, setProductLines] = React.useState<IProductLine[]>([])

  const listTenantsResource = React.useCallback(
    (listTenantQueryParam: ITenantControllerListTenantsParams) =>
      tenantControllerListTenants({
        ...listTenantQueryParam,
        searchBy: searchValue,
      }),
    [searchValue],
  )

  const [listTenantsState, listTenantsFn] =
    useAsyncIntervalFn<IListTenantsResponse>(listTenantsResource)

  const { value, loading: isListTenantsLoading } = listTenantsState

  const { items: tenants = [], total = 0 } = value || {}

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listTenantsFn,
  })

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  const [form] = Form.useForm()

  const handleCloseModalAfterSuccess = () => {
    setIsSubmitLoading(false)
    setSelectedModalType(undefined)
    refresh()
  }

  const editTenant = async () => {
    const values = await form.validateFields()
    const { tenantCmdbName, description, envQuotas, oversoldRatio } = values
    const payload = { tenantCmdbName, description, envQuotas, oversoldRatio: Number(oversoldRatio) }
    setIsSubmitLoading(true)
    try {
      await tenantControllerUpdateTenant({
        tenantId: selectTenantId,
        payload,
      })
      handleCloseModalAfterSuccess()
    } catch (error) {
      setIsSubmitLoading(false)
      message.error(error?.message || 'Edit tenant failed')
    }
  }

  const createTenant = async () => {
    const values = await form.validateFields()
    const { tenantCmdbName, tenantCmdbId, description, envQuotas, oversoldRatio } = values
    const payload = {
      tenantCmdbName,
      tenantCmdbId,
      description,
      envQuotas,
      oversoldRatio: Number(oversoldRatio),
    }
    setIsSubmitLoading(true)
    try {
      await tenantControllerCreateTenant({
        payload,
      })
      handleCloseModalAfterSuccess()
    } catch (error) {
      setIsSubmitLoading(false)
      message.error(error?.message || 'Create tenant failed')
    }
  }

  const handleOk = () => {
    selectedModalType === MODAL_TYPE.EDIT_MODAL ? editTenant() : createTenant()
  }

  const handleCancel = () => {
    setSelectedModalType(undefined)
  }
  const listProductLines = async () => {
    const { items } = await globalControllerListJobs()
    setProductLines(items)
  }

  React.useEffect(() => {
    listProductLines()
  }, [])

  React.useEffect(() => {
    setIsModalVisible(!!selectedModalType)
  }, [selectedModalType])

  const columns: ColumnsType<ITenantListItem> = [
    {
      title: 'ID',
      dataIndex: 'tenantId',
    },
    {
      title: 'Name',
      dataIndex: 'tenantCmdbName',
      render: (tenantCmdbName: string, record) => tenantCmdbName || record.displayName,
    },
    {
      title: 'Product Line',
      dataIndex: 'productLineName',
      filters: productLines.map((item: IProductLine) => ({
        text: item.displayName,
        value: item.displayName,
      })),
      filterIcon: <IFilter />,
    },
    {
      title: 'Quota CPU',
      dataIndex: 'quota',
      render: (quota: IDisplayQuota) => <Quota value={quota.cpu} unit="Cores" />,
    },
    {
      title: 'Quota Memory',
      dataIndex: 'quota',
      render: (quota: IDisplayQuota) => <Quota value={quota.memory} unit="GiB" />,
    },
    {
      title: 'Quota GPU',
      dataIndex: 'quota',
      render: (quota: IDisplayQuota) => <Quota value={quota.gpu} unit="Units" />,
    },
    {
      title: 'Comment',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Space size={16}>
          <StyledButton
            type="link"
            onClick={() => {
              setTenantItem(record)
              setSelectedModalType(MODAL_TYPE.EDIT_MODAL)
              setSelectTenantId(record.tenantId)
            }}
          >
            Edit
          </StyledButton>
          {/* TODO:开放delete入口wewwen.wu@shopee.com */}
          {/* {<StyledButton type='link'>Delete</StyledButton>} */}
        </Space>
      ),
    },
  ]

  return (
    <DetailLayout
      title="Tenant Management"
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs={false}
      body={
        <>
          <ContentWrapper>
            <Row justify="space-between">
              <Col>
                <StyledInput
                  value={searchValue}
                  placeholder="Search..."
                  onChange={(event) => setSearchValue(event.target.value)}
                  suffix={<SearchOutlined />}
                />
              </Col>
              <Col>
                <StyledButton
                  type="primary"
                  style={{ width: '120px' }}
                  onClick={() => {
                    setSelectedModalType(MODAL_TYPE.CREATE_MODAL)
                  }}
                >
                  Create Tenant
                </StyledButton>
              </Col>
            </Row>
            <VerticalDivider size="24px" />
            <Table
              rowKey="tenantId"
              dataSource={tenants}
              columns={columns}
              onChange={handleTableChange}
              locale={{ emptyText: <Empty type="NO_APP" description="No Record Found" /> }}
              loading={isListTenantsLoading}
              pagination={{
                ...TABLE_PAGINATION_OPTION,
                ...pagination,
                total,
              }}
            />
          </ContentWrapper>
          <CrudModal
            key={selectedModalType}
            title={selectedModalType}
            width={1024}
            visible={isModalVisible}
            isSubmitLoading={isSubmitLoading}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose
          >
            <ModalContent
              form={form}
              modalType={selectedModalType}
              tenantItem={selectedModalType === MODAL_TYPE.EDIT_MODAL ? tenantItem : undefined}
            />
          </CrudModal>
        </>
      }
    />
  )
}
export default TenantManagement

import React from 'react'
import { Row, Col, Form, message } from 'infrad'
import { useParams } from 'react-router-dom'
import TableSearchInput from 'components/Common/TableSearchInput'
import TableCreateButton from 'components/Common/TableCreateButton'
import { Table } from 'common-styles/table'
import { ITableParams } from 'types/table'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import {
  accountControllerListTenantUsers,
  accountControllerCreateUsers,
  accountControllerDeleteUserRole,
} from 'swagger-api/apis/Account'
import {
  IListGlobalUsersResponse,
  ICreateUsersBody,
  IProjectRole,
  IDeleteUserRoleBody,
  IUser,
} from 'swagger-api/models'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/useAntdTable'
import { useDebounce } from 'react-use'
import CrudModal from 'components/Common/CrudModal'
import AddUserModalForm from 'components/App/ProjectMGT/Common/AddUserModalForm'
import { USER_MODAL_TITLE } from 'constants/global'
import {
  PLATFORM_ADMIN_ID,
  TENANT_ADMIN_ID,
  TENANT_ROLE_LIST,
  TENANT_USER_MANAGEMENT_ROLE_ID_LIST,
} from 'constants/auth'
import { ColumnsType } from 'infrad/lib/table'
import { StyledButton } from 'components/App/ProjectMGT/TenantDetail/Content/UserManagement/style'
import useCheckRoles from 'hooks/useCheckRoles'

const UserManagement = () => {
  const { tenantId } = useParams()
  const [searchVal, setSearchVal] = React.useState<string>()
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [modalTitle, setModalTitle] = React.useState<USER_MODAL_TITLE | undefined>()
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)
  const isPlatformOrTenantAdmain = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
    {
      roleId: TENANT_ADMIN_ID,
      tenantId,
    },
  ])

  const [form] = Form.useForm()

  const listUsersFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId)
        return accountControllerListTenantUsers({
          tenantId,
          ...tableQueryParams,
          searchBy: searchVal,
        })
    },
    [tenantId, searchVal],
  )
  const [listUsersState, listUsersFn] =
    useAsyncIntervalFn<IListGlobalUsersResponse>(listUsersFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listUsersFn })
  const { items: userList = [], total } = listUsersState.value || {}

  useDebounce(
    () => {
      searchVal !== undefined && refresh()
    },
    500,
    [searchVal],
  )

  const createUser = async (payload: ICreateUsersBody) => {
    try {
      await accountControllerCreateUsers({
        payload,
      })
      message.success('create user success')
      handleModalCancel()
      refresh()
    } catch (error) {
      message.error(error?.message || 'Create user failed')
      setIsSubmitLoading(false)
    }
  }

  const editUser = () => {
    // TODO: edit user @tiancheng.zhang@shopee.com
  }

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields()
      setIsSubmitLoading(true)
      const role: IProjectRole = {
        roleId: values.roleId,
        tenantId,
        projectId: values.projectId ?? undefined,
      }
      const payload: ICreateUsersBody = {
        emails: values.emails,
        role,
      }
      modalTitle === USER_MODAL_TITLE.EDIT_MODAL ? editUser() : createUser(payload)
    } catch (error) {
      setIsSubmitLoading(false)
    }
  }

  const handleModalCancel = () => {
    setIsSubmitLoading(false)
    setModalTitle(undefined)
    form.resetFields()
  }

  const handleDeleteUser = async (record: IUser) => {
    try {
      const payload: IDeleteUserRoleBody = {
        role: {
          roleId: record.roleId,
          tenantId,
        },
      }
      await accountControllerDeleteUserRole({ userId: record.userId, payload })
      message.success('delete user success!')
      refresh()
    } catch (error) {
      message.error(error?.message || 'Delete user failed!')
    }
  }

  React.useEffect(() => {
    setIsModalVisible(!!modalTitle)
  }, [modalTitle])

  const columns: ColumnsType<IUser> = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleId',
      filters: TENANT_ROLE_LIST.map((item) => item),
    },
  ]

  isPlatformOrTenantAdmain &&
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <StyledButton type="link" onClick={() => handleDeleteUser(record)}>
          Delete
        </StyledButton>
      ),
    })

  const handleSearchChange = (value: string) => {
    setSearchVal(value)
  }

  return (
    <>
      <Row justify="space-between">
        <Col>
          <TableSearchInput
            placeholder="Search User..."
            value={searchVal}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Col>
        {isPlatformOrTenantAdmain && (
          <Col>
            <TableCreateButton
              title="Add User"
              onClick={() => {
                setModalTitle(USER_MODAL_TITLE.CREATE_MODAL)
              }}
            />
          </Col>
        )}
      </Row>
      <Table
        rowKey={(record) => `${record.userId}-${record.roleId}`}
        dataSource={userList}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total,
        }}
      />
      <CrudModal
        key={modalTitle}
        visible={isModalVisible}
        title={modalTitle}
        isSubmitLoading={isSubmitLoading}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <AddUserModalForm
          tenantId={tenantId}
          form={form}
          isEdit={modalTitle === USER_MODAL_TITLE.EDIT_MODAL}
          allowedRoleIds={TENANT_USER_MANAGEMENT_ROLE_ID_LIST}
        />
      </CrudModal>
    </>
  )
}

export default UserManagement

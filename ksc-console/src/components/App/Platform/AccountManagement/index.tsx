import * as React from 'react'
import {
  StyledInput,
  StyledTag,
  StyledImg,
  StyledButton,
} from 'components/App/Platform/AccountManagement/style'
import { Row, Col, Empty, message, Form } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'
import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'
import botSvg from 'assets/bot.svg'
import userSvg from 'assets/user.svg'
import {
  accountControllerCreateUsers,
  accountControllerDeleteUserRole,
  accountControllerListGlobalUsers,
  IAccountControllerListGlobalUsersParams,
} from 'swagger-api/apis/Account'
import {
  ICreateUsersBody,
  IDeleteUserRoleBody,
  IListGlobalUsersResponse,
  IProjectRole,
  IUser,
} from 'swagger-api/models'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import useAntdTable from 'hooks/useAntdTable'
import { ColumnsType } from 'infrad/lib/table'
import { USER_MODAL_TITLE, USER_TYPE } from 'constants/global'
import { useDebounce } from 'react-use'
import CrudModal from 'components/Common/CrudModal'
import AddAccountForm from 'components/App/Platform/AccountManagement/AddAccountForm'

/*
 * TODO: wenwen.wu@shopee.com对于注释部分添加筛选过滤
 * enum TABS {
 *   ALL = 'All',
 *   USER = 'User',
 *   BOT = 'Bot'
 * }
 */

const AccountManagement: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState<string>()
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [modalTitle, setModalTitle] = React.useState<USER_MODAL_TITLE | undefined>()
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)

  const [form] = Form.useForm()

  const listAccountUsers = React.useCallback(
    (accountQueryParam: IAccountControllerListGlobalUsersParams) =>
      accountControllerListGlobalUsers({
        ...accountQueryParam,
        searchBy: searchValue,
      }),
    [searchValue],
  )

  const [listAccountUsersState, listAccountUsersFn] =
    useAsyncIntervalFn<IListGlobalUsersResponse>(listAccountUsers)
  const { value, loading: isLoadingListAccountUsers } = listAccountUsersState

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listAccountUsersFn,
  })
  const { items: accountUsers = [], total = 0 } = value || {}

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
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
        tenantId: values.tenantId ?? undefined,
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
  }

  const handleDeleteUser = async (record: IUser) => {
    try {
      const payload: IDeleteUserRoleBody = {
        role: {
          roleId: record.roleId,
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
      title: 'ID',
      key: 'userId',
      dataIndex: 'userId',
    },
    {
      title: 'Name',
      key: 'displayName',
      dataIndex: 'displayName',
      render: (displayName: string, record) => {
        const svg = record.userType === USER_TYPE.BOT ? botSvg : userSvg
        return (
          <StyledTag type={record.roleId} icon={<StyledImg src={svg} />}>
            {displayName}
          </StyledTag>
        )
      },
    },
    {
      title: 'Email/Description',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      key: 'roleName',
      dataIndex: 'roleName',
      /*
       * TODO:添加filterswewnen.wu@shopee.com
       * filters: accountUsers.map((item: IUser) => ({
       *   text: item.roleName,
       *   value: item.roleName
       * }))
       */
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <StyledButton type="link" onClick={() => handleDeleteUser(record)}>
          Delete
        </StyledButton>
      ),
    },
  ]

  return (
    <>
      <Row justify="space-between">
        <Col>
          <Row>
            <Col>
              {/* <UserTypeRadioGroup>
                <Radio.Group defaultValue={TABS.ALL} onChange={handleRadioChange}>
                  {Object.entries(TABS).map(([key, value]) => (
                    <Radio.Button key={key} value={value}>
                      {value}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </UserTypeRadioGroup> */}
            </Col>
            <Col>
              <StyledInput
                value={searchValue}
                placeholder="Search..."
                onChange={(event) => setSearchValue(event.target.value)}
                suffix={<SearchOutlined />}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <StyledButton
            type="primary"
            width="113px"
            onClick={() => {
              setModalTitle(USER_MODAL_TITLE.CREATE_MODAL)
            }}
          >
            Add Account
          </StyledButton>
        </Col>
      </Row>
      <VerticalDivider size="24px" />
      <Table
        rowKey={(record) => `${record.userId}-${record.roleId}`}
        dataSource={accountUsers}
        columns={columns}
        onChange={handleTableChange}
        loading={isLoadingListAccountUsers}
        locale={{ emptyText: <Empty type="NO_APP" description="No Record Found" /> }}
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
        <AddAccountForm form={form} isEdit={modalTitle === USER_MODAL_TITLE.EDIT_MODAL} />
      </CrudModal>
    </>
  )
}
export default AccountManagement

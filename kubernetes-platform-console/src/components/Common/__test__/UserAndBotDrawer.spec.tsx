import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AddUserDrawer, SessionKeyDrawer } from 'components/Common/UserAndBotDrawer'
import { UserType } from 'constants/rbacActions'
import { PLATFORM_ADMIN_ID } from 'constants/accessControl'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  })
})

const tenantId = 1

jest.mock('swagger-api/v3/apis/UserRole', () => ({
  roleControllerGetTenantPermissionGroups() {
    return {
      roles: [
        {
          id: 2001,
          name: 'Tenant Admin',
          roleScope: 1
        }
      ]
    }
  }
}))

jest.mock('swagger-api/v3/apis/Tenants', () => ({
  groupsControllerAddTenantUsers: jest.fn(),
  groupsControllerAddTenantBot: jest.fn(),
  groupsControllerGenerateBotAccessToken() {
    return {
      sessionKey: 'sessionKey'
    }
  }
}))

describe('Add User Drawer test', () => {
  test('drawer visible', async () => {
    await act(async () => {
      render(
        <AddUserDrawer
          visible={true}
          onHideDrawer={jest.fn()}
          onRefresh={jest.fn()}
          tenantId={tenantId}
          selectedUserType={UserType.USER}
        />
      )
    })
    expect(screen.getByText('User Type')).toBeVisible()
  })

  test('handler test', async () => {
    const onHideDrawer = jest.fn()
    const onRefresh = jest.fn()

    await act(async () => {
      const { container } = render(
        <AddUserDrawer
          visible={true}
          onHideDrawer={onHideDrawer}
          onRefresh={onRefresh}
          tenantId={tenantId}
          selectedUserType={UserType.USER}
        />
      )
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test@shopee.com' }
      })
      fireEvent.mouseDown(container.querySelector('.ant-select-selector') as Element)
      expect(await screen.findByText('Tenant Admin')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Tenant Admin'))
      fireEvent.click(screen.queryByText('Submit'))
    })
    expect(onHideDrawer).toBeCalled()
    expect(onHideDrawer).toBeCalledTimes(1)
    expect(onRefresh).toBeCalled()
    expect(onRefresh).toBeCalledTimes(1)
  })
})

describe('Session key drawer test', () => {
  test('generate session key', async () => {
    render(
      <SessionKeyDrawer
        visible={true}
        onHideDrawer={jest.fn()}
        selectedUser={{
          name: 'test',
          id: 1,
          roleId: PLATFORM_ADMIN_ID
        }}
        tenantId={tenantId}
      />
    )
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password' }
      })
      fireEvent.click(screen.queryByText('Submit'))
    })
    expect(screen.queryByText('Successfully')).toBeTruthy()
    await act(async () => {
      fireEvent.click(screen.queryByText('Copy Session Key'))
    })
    expect(screen.queryByText('Copy Successfully!')).toBeTruthy()
  })
})

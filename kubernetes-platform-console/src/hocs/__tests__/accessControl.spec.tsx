import * as React from 'react'
import * as recoil from 'recoil'
// import * as accessControlApis from 'api/accessControl'
import * as indexApis from 'swagger-api/v1/apis/Index'
import { render, screen, waitFor } from '@testing-library/react'
import accessControl from '../accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { IAccessControlResponse } from 'api/types/accessControl'

jest.useFakeTimers()

let useRecoilValueMock: jest.SpyInstance = null
let getResourceAccessControlMock: jest.SpyInstance = null

const mockGroup = 'Mock group'

const MockDecoratedComponent = () => <div>mock component</div>

const generateMockResult = (): IAccessControlResponse => {
  return {
    ClusterQuota: [],
    Cluster: [RESOURCE_ACTION.View, RESOURCE_ACTION.Edit, RESOURCE_ACTION.Delete],
    Node: [],
    Tenant: [],
    GlobalUser: [],
    GlobalBot: [],
    OperationLog: [],
    TerminalTicket: [],
    AccessTicket: [],
    TenantUser: [],
    TenantBot: [],
    ProjectQuota: [],
    Project: [],
    Application: [],
    'Application/DeployConfig': [],
    Service: [],
    Ingress: [],
    Deployment: [],
    Pod: [],
    'Pod/Terminal': [],
    Pipeline: [],
    ReleaseFreeze: [],
    OPS: [],
    HPARules: [],
    HPAController: [],
    Zone: []
  }
}

const mockImplementationFn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(generateMockResult())
    }, 200)
  })
}

beforeEach(() => {
  getResourceAccessControlMock = jest
    .spyOn(indexApis, 'rbacControllerGetResourcePermissions')
    .mockImplementation(mockImplementationFn)
  useRecoilValueMock = jest.spyOn(recoil, 'useRecoilValue')
  useRecoilValueMock.mockReturnValue(mockGroup)
})

afterEach(() => {
  getResourceAccessControlMock.mockRestore()
  useRecoilValueMock.mockRestore()
})

describe('render', () => {
  it('should render the `DecoratedComponent` at once if checking access control is not crucial', () => {
    const AccessControlHoc = accessControl(
      MockDecoratedComponent,
      PERMISSION_SCOPE.GLOBAL,
      [RESOURCE_TYPE.CLUSTER, RESOURCE_TYPE.ACCESS_TICKET],
      false
    )
    render(<AccessControlHoc />)
    expect(getResourceAccessControlMock).toBeCalled()
    expect(screen.getByText('mock component')).toBeTruthy()
  })

  it('should render loading component at once when checking access control is crucial, and render `DecoratedComponent` when checked', async () => {
    const AccessControlHoc = accessControl(
      MockDecoratedComponent,
      PERMISSION_SCOPE.GLOBAL,
      [RESOURCE_TYPE.CLUSTER, RESOURCE_TYPE.OPERATION_LOG],
      true
    )
    render(<AccessControlHoc />)
    expect(getResourceAccessControlMock).toBeCalled()
    expect(screen.getByText('checking permission')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('mock component')).toBeTruthy())
  })
})

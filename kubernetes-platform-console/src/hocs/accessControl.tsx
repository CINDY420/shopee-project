import * as React from 'react'
import { Spin, Result } from 'infrad'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import useAsyncFn from 'hooks/useAsyncFn'
import { selectedTenant } from 'states/applicationState/tenant'
import { selectedGatewayTenant } from 'states/gatewayState'
import { AccessControlContext } from 'hooks/useAccessControl'
import { rbacControllerGetResourcePermissions } from 'swagger-api/v1/apis/Index'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'

const SpinWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

/**
 * Request the permission of the resource, and pass the permission information to the DecoratedComponent through context.
 *
 * @param DecoratedComponent Components that require permission judgment
 * @param resources string[]  Array of resources requesting permission
 * @param crucial boolean  Indicates if checking access control is crucial for this component. Defaults to true
 */
const AccessControl = (
  DecoratedComponent: React.ComponentType,
  scope: PERMISSION_SCOPE,
  resources: RESOURCE_TYPE[],
  crucial = true // Indicates if checking access control is crucial for this component
) => {
  return props => {
    const tenantState = useRecoilValue(selectedTenant) || {}
    const gatewayTenantState = useRecoilValue(selectedGatewayTenant) || {}
    const { id: tenantId = undefined } = { ...gatewayTenantState, ...tenantState }
    const fetchResourceAccessFn = React.useCallback(async () => {
      let result
      if (scope === PERMISSION_SCOPE.TENANT && tenantId) {
        result = await rbacControllerGetResourcePermissions({ scope, resources, tenantId })
      } else {
        result = await rbacControllerGetResourcePermissions({ scope, resources })
      }
      return result
    }, [tenantId])

    const [fetchState, fetchFn] = useAsyncFn(fetchResourceAccessFn)

    const accessControlContext = fetchState.value
    const fetchError = fetchState.error

    React.useEffect(() => {
      fetchFn()
    }, [fetchFn])

    const accessControlProvidedElement = (
      <AccessControlContext.Provider value={accessControlContext || {}}>
        <DecoratedComponent {...props} />
      </AccessControlContext.Provider>
    )
    if (!crucial) {
      return accessControlProvidedElement
    }

    return fetchState.loading === false && accessControlContext ? (
      accessControlProvidedElement
    ) : fetchError ? (
      <Result status={(fetchError.code + '') as any} title={fetchError.message} />
    ) : (
      <SpinWrapper>
        <Spin tip='checking permission' />
      </SpinWrapper>
    )
  }
}

export default AccessControl

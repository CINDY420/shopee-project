import * as React from 'react'
import { IAccessControlResponse } from 'api/types/accessControl'

/**
 * Used for AccessControl in hocs
 */

export const AccessControlContext = React.createContext<IAccessControlResponse | {}>({})

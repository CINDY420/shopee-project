import React from 'react'
import { PERMISSION_RESOURCE, PERMISSION_ACTION } from 'constants/permission'
import { globalAuthState } from 'states'
import { useRecoilValue } from 'recoil'

/**
 * useCheckPermission 用来校验权限
 * @param resource 项目的资源目录名
 * @returns checkPermission函数，接受行为参数，判断该目录下是否有某一个行为的权限
 */
export default function useCheckPermission(resource: PERMISSION_RESOURCE) {
  const { permissions } = useRecoilValue(globalAuthState)
  const [actionLists, setActionLists] = React.useState<string[]>([])

  React.useEffect(() => {
    if (permissions?.[resource]) setActionLists(permissions?.[resource])
  }, [resource, permissions])

  function checkPermission(action: PERMISSION_ACTION = PERMISSION_ACTION.LIST): boolean {
    return actionLists.includes(action)
  }
  return checkPermission
}

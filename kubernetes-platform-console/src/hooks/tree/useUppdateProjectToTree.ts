import * as React from 'react'
import { useRecoilState } from 'recoil'

import { tree } from 'states/applicationState/tree'
import { getItemFromArrWithKeyValue } from 'helpers/array'
import { treesControllerGetTenantProjectTree } from 'swagger-api/v3/apis/Tree'

/**
 * Update the value of ProjectTree in recoil
 * @return A function, updateClusterToTreeFn, which should be invoked when the project changes
 */

const useUpdateProjectToTree = () => {
  const [preGroups, setPreGroups] = useRecoilState(tree)

  const updateProjectToTreeFn = React.useCallback(
    async (groupName: string) => {
      const { tenants } = await treesControllerGetTenantProjectTree()

      const prevGroup = getItemFromArrWithKeyValue(preGroups, 'name', groupName)
      const targetGroup = getItemFromArrWithKeyValue(tenants, 'name', groupName)

      if (!prevGroup || !targetGroup) {
        return
      }

      preGroups.forEach((group: any, index) => {
        if (group.name !== groupName) {
          tenants[index] = group
        } else {
          for (const prevProject of prevGroup.projects) {
            const targetProject = getItemFromArrWithKeyValue(targetGroup.projects, 'name', prevProject.name)
            if (targetProject) {
              targetProject.applications = prevProject.applications || []
            }
          }
        }
      })

      setPreGroups(tenants)
      return tenants
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preGroups]
  )

  return updateProjectToTreeFn
}

export default useUpdateProjectToTree

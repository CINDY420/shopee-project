import * as React from 'react'
import { useRecoilState } from 'recoil'

import { tree } from 'states/applicationState/tree'
import { getItemFromArrWithKeyValue } from 'helpers/array'
import { treesControllerGetTenantProjectTree, treesControllerGetApplicationTree } from 'swagger-api/v3/apis/Tree'

/**
 * Update the value of applicationTree in recoil
 * @return A function, updateClusterToTreeFn, which should be invoked when the application changes
 */

const useUpdateApplicationToTree = () => {
  const [preGroups, setPreGroups] = useRecoilState(tree)

  const updateApplicationToTreeFn = React.useCallback(
    async (tenantId: number, projectName: string) => {
      const { tenants } = await treesControllerGetTenantProjectTree()

      const prevGroup = getItemFromArrWithKeyValue(preGroups, 'id', tenantId)
      const targetGroup = getItemFromArrWithKeyValue(tenants, 'id', tenantId)
      const targetProject = getItemFromArrWithKeyValue(targetGroup.projects, 'name', projectName)

      if (!prevGroup || !targetGroup || !targetProject) {
        return
      }

      const applications = await treesControllerGetApplicationTree({ tenantId, projectName })

      preGroups.forEach((group: any, index) => {
        if (group.id !== tenantId) {
          tenants[index] = group
        } else {
          for (const prevProject of prevGroup.projects) {
            const currentTargetProject = getItemFromArrWithKeyValue(targetGroup.projects, 'name', prevProject.name)
            if (currentTargetProject) {
              if (currentTargetProject.name === projectName) {
                currentTargetProject.applications = applications
              } else {
                currentTargetProject.applications = prevProject.applications || []
              }
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

  return updateApplicationToTreeFn
}

export default useUpdateApplicationToTree

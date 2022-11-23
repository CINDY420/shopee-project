import React, { useState } from 'react'

import { IReleaseFreezeDetail } from 'api/types/application/pipeline'

import DetailLayout from 'components/Common/DetailLayout'
import { Card } from 'common-styles/cardWrapper'
import FreezeTable from './FreezesTable'
import { Button } from 'infrad'
import { Root } from './style'

import accessControl from 'hocs/accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'

const ReleseFreezes: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedFreeze, setSelectedFreeze] = useState<IReleaseFreezeDetail>()

  const accessControlContext = React.useContext(AccessControlContext)
  const releaseFreezeActions = accessControlContext[RESOURCE_TYPE.RELEASE_FREEZE] || []
  const canCreate = releaseFreezeActions.includes(RESOURCE_ACTION.Create)
  const canEdit = releaseFreezeActions.includes(RESOURCE_ACTION.Edit)
  const canStop = releaseFreezeActions.includes(RESOURCE_ACTION.Stop)

  const showEditDrawer = (freeze?: IReleaseFreezeDetail) => {
    setDrawerVisible(true)
    setSelectedFreeze(freeze || undefined)
  }
  const closeEditDrawer = () => setDrawerVisible(false)

  return (
    <DetailLayout
      title='Release Freeze'
      tags={[]}
      isHeaderWithBottomLine={false}
      ExtraButton={() => (
        <Button type='primary' style={{ fontWeight: 500 }} onClick={() => showEditDrawer()} disabled={!canCreate}>
          Create Release Freeze
        </Button>
      )}
      body={
        <Root>
          <Card height='100%' padding='0 24px' boxShadow='none'>
            <FreezeTable
              drawerVisible={drawerVisible}
              onHideDrawer={closeEditDrawer}
              selectedFreeze={selectedFreeze}
              showEditDrawer={showEditDrawer}
              canEdit={canEdit}
              canStop={canStop}
            />
          </Card>
        </Root>
      }
    />
  )
}

export default accessControl(ReleseFreezes, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.RELEASE_FREEZE])

import * as React from 'react'

import { useRecoilValue } from 'recoil'
import { MigrationContext, initialState, reducer } from './useMigrationContext'

import DetailLayout from '../Common/DetailLayout'
import Content from './Content'
import MigrationTaskStatus from './MigrationTaskStatus'

import { Root } from './style'
import { selectedTenant } from 'states/applicationState/tenant'

const PipelineList: React.FC = () => {
  const listPipelines = useRecoilValue(selectedTenant)
  const { id: tenantId } = listPipelines

  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <MigrationContext.Provider value={{ state, dispatch }}>
      <DetailLayout
        title='Pipeline List'
        isHeaderWithBottomLine={false}
        tags={[]}
        extraDetail={<MigrationTaskStatus />}
        body={
          <Root>
            <Content tenantId={tenantId} />
          </Root>
        }
      />
    </MigrationContext.Provider>
  )
}

export default PipelineList

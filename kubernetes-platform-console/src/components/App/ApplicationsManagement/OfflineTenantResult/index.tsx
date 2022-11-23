import * as React from 'react'
import { Button, Result } from 'infrad'
import { Root } from 'components/App/ApplicationsManagement/OfflineTenantResult/style'

const OfflineTenantResult: React.FC = () => {
  return (
    <Root>
      <Result
        title='Please use Space to view and manage your containers.'
        extra={
          <Button type='primary' key='console' onClick={() => window.open('https://space.shopee.io/console/cmdb')}>
            Go to SPACE
          </Button>
        }
      />
    </Root>
  )
}

export default OfflineTenantResult

import React from 'react'
import { Result, Button } from 'infrad'
import { DEFAULT_ROUTE } from 'src/constants/routes/routes'
import { Link } from 'react-router-dom'

const NoPermission: React.FC = () => (
  <Result
    status="403"
    title={<Link to={DEFAULT_ROUTE}>Refresh</Link>}
    subTitle='Sorry, you are not authorized to access this page. Please click the "Permission" button below to apply for permissions.'
    extra={
      <a href="https://space.shopee.io/utility/sam/permission">
        <Button type="primary">Permission</Button>
      </a>
    }
  />
)
export default NoPermission

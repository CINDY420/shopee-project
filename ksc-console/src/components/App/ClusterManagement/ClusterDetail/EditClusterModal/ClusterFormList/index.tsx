import React from 'react'
import { Form, FormInstance } from 'infrad'
import {
  StyledTableWrapper,
  StyledTenantName,
} from 'components/App/ClusterManagement/ClusterDetail/EditClusterModal/ClusterFormList/style'
import QuotaFormTable from 'components/App/ClusterManagement/ClusterDetail/EditClusterModal/ClusterFormList/QuotaFormTable'
import { IClusterTenantListItem } from 'swagger-api/models'

interface IClusterFormListProps {
  form: FormInstance
  tenantsList: IClusterTenantListItem[]
}

const ClusterFormList: React.FC<IClusterFormListProps> = ({ form, tenantsList }) => (
  <>
    {tenantsList.map((item) => (
      <Form.List name={['quotas', item.tenantId]} key={item.tenantId}>
        {(fields) => (
          <>
            <StyledTenantName>{item.displayName}</StyledTenantName>
            <StyledTableWrapper>
              <QuotaFormTable form={form} tenantData={item} fields={fields} />
            </StyledTableWrapper>
          </>
        )}
      </Form.List>
    ))}
  </>
)

export default ClusterFormList

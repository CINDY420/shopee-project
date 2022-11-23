import * as React from 'react'
import { message } from 'infrad'
import AssignmentPolicy from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/AssignmentPolicy'
import CanaryDeployment from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CanaryDeployment'
import ExtraConfig from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/ExtraConfig'
import InstanceCount from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/InstanceCount'
import MinimumInstanceCount from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/MinimumInstanceCount'
import CountryAZ from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CountryAZ'
import ComponentType from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/ComponentType'
import Resources from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Resources'
import Strategy from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy'
import { EnabledAlert } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/EnableAlert'
import {
  IUpdateNewDeployConfig,
  VALIDATE_STATUS,
  VALIDATE_TYPES
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig'
import {
  DeployConfigContext,
  getDispatchers,
  getConvertedFormValues
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import ZoneManagement from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/ZoneManagement'
import { selectedTenant } from 'states/applicationState/tenant'
import { ITenantDetail } from 'api/types/application/group'
import { useRecoilValue } from 'recoil'

interface IListViewProps {
  enable: boolean
  updateNewDeployConfigState: IUpdateNewDeployConfig | undefined
  onValidateFinish: (state: IUpdateNewDeployConfig) => void
}

const ListView: React.FC<IListViewProps> = ({ enable, updateNewDeployConfigState, onValidateFinish }) => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const { deployConfigForms, errors, componentType, hybridDeployTenants } = state
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const hasError = Object.values(errors).includes(true)

  const tenantDetail: ITenantDetail = useRecoilValue(selectedTenant)
  const { id: tenantId } = tenantDetail

  const convertDeployFormValues = React.useCallback(async () => {
    const newDeployConfig = await getConvertedFormValues(deployConfigForms)
    dispatchers.updateNewDeployConfig(newDeployConfig)
  }, [deployConfigForms, dispatchers])

  React.useEffect(() => {
    if (updateNewDeployConfigState === undefined) return
    const { validateType, validateStatus } = updateNewDeployConfigState
    if (validateType === VALIDATE_TYPES.FORM && validateStatus === VALIDATE_STATUS.START) {
      if (hasError) {
        message.error('Form data validation failed, please resolve it before')
        onValidateFinish(undefined)
      } else {
        convertDeployFormValues()
          .then(() => {
            onValidateFinish({
              ...updateNewDeployConfigState,
              validateStatus: VALIDATE_STATUS.SUCCESS
            })
          })
          .catch(() => {
            onValidateFinish(undefined)
          })
      }
    }
  }, [convertDeployFormValues, hasError, onValidateFinish, updateNewDeployConfigState])

  return (
    <>
      <EnabledAlert enable={enable}></EnabledAlert>
      <CountryAZ />
      {hybridDeployTenants.includes(tenantId?.toString()) ? <ZoneManagement /> : null}
      <ComponentType />
      <Resources />
      <InstanceCount />
      <MinimumInstanceCount />
      {componentType.bromo?.length || componentType.nonBromo?.length ? <Strategy /> : null}
      <CanaryDeployment />
      {componentType.nonBromo?.length ? <ExtraConfig /> : null}
      {componentType.bromo?.length ? <AssignmentPolicy /> : null}
    </>
  )
}

export default ListView

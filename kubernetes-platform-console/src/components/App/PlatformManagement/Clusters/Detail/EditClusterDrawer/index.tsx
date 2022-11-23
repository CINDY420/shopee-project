import * as React from 'react'
import { message } from 'infrad'

import Drawer from 'components/Common/CrudDrawer'
import ClusterForm from './EditClusteForm'
import { ClusterConfigNames } from 'constants/cluster'
import { clustersControllerGetClusterConfig, clustersControllerUpdateClusterConfig } from 'swagger-api/v3/apis/Cluster'
import { globalControllerGetCids, globalControllerGetEnvs, globalControllerGetGroups } from 'swagger-api/v3/apis/Global'
import useAsyncFn from 'hooks/useAsyncFn'
import { IClusterConfig } from 'api/types/cluster/config'

interface IClusterFormDrawerProps {
  visible: boolean
  clusterName: string
  closeDrawer: () => void
  onSubmit: (param: any) => void
  submitCallback: () => void
}

const ClusterFormDrawer: React.FC<IClusterFormDrawerProps> = (props: IClusterFormDrawerProps) => {
  const { visible, clusterName, closeDrawer, submitCallback } = props

  const [isChanged, setIsChanged] = React.useState(false)
  const [clusterConfig, setClusterConfig] = React.useState<IClusterConfig>({} as IClusterConfig)
  const defaultData = React.useRef({})
  const [, getClusterFn] = useAsyncFn(clustersControllerGetClusterConfig)
  const [, updateClusterFn] = useAsyncFn(clustersControllerUpdateClusterConfig)

  const fetchFns = {
    environments: globalControllerGetEnvs,
    cids: globalControllerGetCids,
    tenants: globalControllerGetGroups
  }

  const handleChange = (key, value) => {
    const newData = { ...clusterConfig }
    newData[key] = value
    setClusterConfig(newData)
    setIsChanged(isClusterConfigChanged(newData))
  }

  const isClusterConfigChanged = newData => {
    for (const key in newData) {
      if (defaultData.current[key].length !== newData[key].length) {
        return true
      }
    }
    return false
  }

  const resetClusterConfig = () => {
    getClusterFn({ clusterName }).then(res => {
      setClusterConfig(res)
      defaultData.current = res
    })
  }

  React.useEffect(() => {
    if (clusterName) {
      resetClusterConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterName])

  return (
    <>
      <Drawer
        title='Edit Cluster'
        isSubmitDisabled={!isChanged}
        visible={visible}
        closeDrawer={() => {
          closeDrawer()
          resetClusterConfig()
        }}
        body={Object.keys(clusterConfig).map((obj, idx) => (
          <ClusterForm
            key={idx}
            title={ClusterConfigNames[obj]}
            initialData={clusterConfig[obj]}
            fetchFn={fetchFns[obj]}
            onChange={handleChange}
            type={obj}
          />
        ))}
        onSubmit={async () => {
          await updateClusterFn({ clusterName, payload: clusterConfig })
          message.success('Edit success!')
          resetClusterConfig()
          submitCallback()
          closeDrawer()
        }}
      ></Drawer>
    </>
  )
}

export default ClusterFormDrawer

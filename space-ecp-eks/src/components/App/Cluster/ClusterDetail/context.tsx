import { createContext } from 'react'

interface IClusterDetailContext {
  clusterId?: string
}

export const ClusterDetailContext = createContext<IClusterDetailContext>({})

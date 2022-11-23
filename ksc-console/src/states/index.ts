import { IUserInfo } from 'helpers/session'
import { atom } from 'recoil'
import {
  IGetTenantResponse,
  IGetProjectResponse,
  IGetJobResponse,
  IGetClusterResponse,
  IGetPeriodicJobResponse,
} from 'swagger-api/models'

export const globalAuthState = atom<IUserInfo | Record<string, never>>({
  key: 'globalAuthState',
  default: {},
})

export const selectedTenant = atom<IGetTenantResponse | Record<string, never>>({
  key: 'selectedTenant',
  default: {},
})

export const selectedProject = atom<IGetProjectResponse | Record<string, never>>({
  key: 'selectedProject',
  default: {},
})

export const selectedJob = atom<IGetJobResponse | Record<string, never>>({
  key: 'selectedJob',
  default: {},
})

export const selectedCluster = atom<IGetClusterResponse | Record<string, never>>({
  key: 'selectedCluster',
  default: {},
})

export const selectedPeriodicJob = atom<IGetPeriodicJobResponse | Record<string, never>>({
  key: 'selectedPeriodicJob',
  default: {},
})

export const selectedPeriodicJobInstance = atom<IGetJobResponse | Record<string, never>>({
  key: 'selectedPeriodicJobInstance',
  default: {},
})

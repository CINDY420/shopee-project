import { ConfigModule } from '@nestjs/config'
import { cloneDeep } from 'lodash'
import { Test, TestingModule } from '@nestjs/testing'
import configuration from 'common/config/configuration'
import { ACCESS_CONTROL_VERBS, GROUP_RESOURCES, RBAC_ROLES } from 'common/constants/rbac'
import { ESService } from 'common/modules/es/es.service'
import { booleanMerge } from 'common/helpers/object'
// import { IResourceAccessControl } from './entities/rbac.entity'
// import { RbacService, makeResourceAccessControl } from './rbac.service'

import {
  defaultAuthUser,
  authorizedGroupSettings,
  baseReturn,
  othersGlobalReturn,
  includedGroupReturn,
  infraGlobalReturn,
  infraAdminUserGlobalReturn,
  infraGroupReturn,
  SREGroupReturn,
  otherRoleGroupReturn,
  whiteUserGlobalReturn,
  managerGlobalReturn,
  managerGroupReturn,
  codeFreezeGroupReturn,
  twoRolesGroupReturn,
  bossGlobalReturn
} from './test-constants/rbac.test.data'

describe('RbacService', () => {
  // let service: RbacService
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       ConfigModule.forRoot({
  //         isGlobal: true,
  //         load: [configuration]
  //       })
  //     ],
  //     providers: [RbacService, ESService]
  //   }).compile()
  //   service = module.get<RbacService>(RbacService)
  // })
  // it('should be defined', () => {
  //   expect(service).toBeDefined()
  // })
})

describe('makeResourceAccessControl', () => {
  // it('it should set availableVerbs to verbs by default', () => {
  //   const verbs = [ACCESS_CONTROL_VERBS.CREATE, ACCESS_CONTROL_VERBS.DELETE]
  //   const resourceAccessControl = makeResourceAccessControl(GROUP_RESOURCES.APPLICATION, verbs)
  //   expect(resourceAccessControl).toEqual({
  //     availableVerbs: {
  //       [ACCESS_CONTROL_VERBS.CREATE]: true,
  //       [ACCESS_CONTROL_VERBS.DELETE]: true
  //     },
  //     resource: GROUP_RESOURCES.APPLICATION,
  //     verbs: [ACCESS_CONTROL_VERBS.CREATE, ACCESS_CONTROL_VERBS.DELETE]
  //   } as IResourceAccessControl)
  // })
  it('it should set availableVerbs with availableVerbs arguments', () => {
    // const verbs = [ACCESS_CONTROL_VERBS.CREATE, ACCESS_CONTROL_VERBS.DELETE]
    // const resourceAccessControl = makeResourceAccessControl(GROUP_RESOURCES.APPLICATION, verbs, [
    //   ACCESS_CONTROL_VERBS.CREATE
    // ])
    // expect(resourceAccessControl).toEqual({
    //   availableVerbs: {
    //     [ACCESS_CONTROL_VERBS.CREATE]: true,
    //     [ACCESS_CONTROL_VERBS.DELETE]: false
    //   },
    //   resource: GROUP_RESOURCES.APPLICATION,
    //   verbs: [ACCESS_CONTROL_VERBS.CREATE, ACCESS_CONTROL_VERBS.DELETE]
    // } as IResourceAccessControl)
  })
})

describe('getRbacUserByAuthUser', () => {
  // let service: RbacService
  // let global = RBAC_ROLES.OTHERS
  // let groups = ['Infrastructure Team:FE']
  // let isRBAC = true
  // let authUser = cloneDeep(defaultAuthUser)
  // let infraBaseReturn = cloneDeep(baseReturn)
  // infraBaseReturn = booleanMerge(
  //   {
  //     groups: {
  //       'Infrastructure Team': authorizedGroupSettings
  //     }
  //   },
  //   infraBaseReturn
  // )
  // class ESService {
  //   termQueryFirst(index, key, email) {
  //     return isRBAC
  //       ? {
  //           email,
  //           global,
  //           groups
  //         }
  //       : null
  //   }
  // }
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       ConfigModule.forRoot({
  //         isGlobal: true,
  //         load: [configuration]
  //       })
  //     ],
  //     providers: [RbacService, ESService]
  //   }).compile()
  //   service = module.get<RbacService>(RbacService)
  //   authUser = cloneDeep(defaultAuthUser)
  // })
  it('rbac test, global OTHERS', async () => {
    // isRBAC = true
    // global = RBAC_ROLES.OTHERS
    // groups = ['Infrastructure Team:FE']
    // const result = await service.getRbacUserByAuthUser(authUser)
    // let othersReturn = cloneDeep(infraBaseReturn)
    // othersReturn = booleanMerge(othersGlobalReturn, othersReturn)
    // expect(result).toEqual(othersReturn)
  })
  // it('rbac test, global BOSS', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.BOSS
  //   groups = ['Infrastructure Team:FE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let bossReturn = cloneDeep(infraBaseReturn)
  //   bossReturn = booleanMerge(bossGlobalReturn, bossReturn)
  //   expect(result).toEqual(bossReturn)
  // })
  // it('rbac test, global MANAGER', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.MANAGER
  //   groups = ['Infrastructure Team:FE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let managerReturn = cloneDeep(infraBaseReturn)
  //   managerReturn = booleanMerge(
  //     {
  //       global: {
  //         rules: {
  //           codeFreeze: {
  //             availableVerbs: {
  //               View: true
  //             }
  //           },
  //           auth: {
  //             availableVerbs: {
  //               ViewApprove: true
  //             }
  //           },
  //           clusterTab: {
  //             availableVerbs: {
  //               View: true
  //             }
  //           }
  //         }
  //       }
  //     },
  //     managerReturn
  //   )
  //   expect(result).toEqual(managerReturn)
  // })
  // it('rbac test, global SRE', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.SRE
  //   groups = ['Infrastructure Team:FE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let sreReturn = cloneDeep(infraBaseReturn)
  //   sreReturn = booleanMerge(infraGlobalReturn, sreReturn)
  //   expect(result).toEqual(sreReturn)
  // })
  // it('rbac test, global SRE && groups SRE', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.SRE
  //   groups = ['Infrastructure Team:SRE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let sreReturn = cloneDeep(infraBaseReturn)
  //   sreReturn = booleanMerge(sreReturn, {
  //     ...infraGlobalReturn,
  //     groups: {
  //       'Seller Group': SREGroupReturn,
  //       'Financial Services Group': SREGroupReturn,
  //       'To C Group': SREGroupReturn,
  //       'Supply Chain Group': SREGroupReturn,
  //       'Infrastructure Team': infraGroupReturn,
  //       'Client Group': SREGroupReturn,
  //       Banking: SREGroupReturn,
  //       'Data Science Group': SREGroupReturn
  //     }
  //   })
  //   expect(result).toEqual(sreReturn)
  // })
  // it('rbac test, global DEVOPS', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.DEVOPS
  //   groups = ['Infrastructure Team:FE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let developsReturn = cloneDeep(infraBaseReturn)
  //   developsReturn = booleanMerge(infraGlobalReturn, developsReturn)
  //   expect(result).toEqual(developsReturn)
  // })
  // it('rbac test, user without group', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.OTHERS
  //   groups = []
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let withoutGroupReturn = cloneDeep(infraBaseReturn)
  //   withoutGroupReturn = booleanMerge(othersGlobalReturn, withoutGroupReturn)
  //   expect(result).toEqual(withoutGroupReturn)
  // })
  // it('rbac test, user with different roles in same group', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.OTHERS
  //   groups = ['Infrastructure Team:FE', 'Infrastructure Team:QA']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let diffRoleReturn = cloneDeep(infraBaseReturn)
  //   diffRoleReturn = booleanMerge(
  //     {
  //       ...othersGlobalReturn,
  //       groups: {
  //         'Infrastructure Team': otherRoleGroupReturn
  //       }
  //     },
  //     diffRoleReturn
  //   )
  //   expect(result).toEqual(diffRoleReturn)
  // })
  // it('rbac test, user with same role in different groups', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.OTHERS
  //   groups = ['Infrastructure Team:FE', 'To C Group:FE']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let diffGroupReturn = cloneDeep(infraBaseReturn)
  //   diffGroupReturn = booleanMerge(
  //     {
  //       ...othersGlobalReturn,
  //       groups: {
  //         'To C Group': includedGroupReturn
  //       }
  //     },
  //     diffGroupReturn
  //   )
  //   expect(result).toEqual(diffGroupReturn)
  // })
  // it('rbac test, user with different roles in different groups', async () => {
  //   isRBAC = true
  //   global = RBAC_ROLES.OTHERS
  //   groups = ['Infrastructure Team:FE', 'To C Group:QA']
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let bothDiffReturn = cloneDeep(infraBaseReturn)
  //   bothDiffReturn = booleanMerge(
  //     {
  //       ...othersGlobalReturn,
  //       groups: {
  //         'To C Group': twoRolesGroupReturn
  //       }
  //     },
  //     bothDiffReturn
  //   )
  //   expect(result).toEqual(bothDiffReturn)
  // })
  // // ---------------- auth test ----------------
  // it('auth test, normal user', async () => {
  //   isRBAC = false
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let normalUserReturn = cloneDeep(infraBaseReturn)
  //   normalUserReturn = booleanMerge(whiteUserGlobalReturn, normalUserReturn)
  //   expect(result).toEqual(normalUserReturn)
  // })
  // it('auth test, isInfra', async () => {
  //   isRBAC = false
  //   authUser.isInfra = true
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let infraReturn = cloneDeep(infraBaseReturn)
  //   infraReturn = booleanMerge(infraReturn, {
  //     ...infraGlobalReturn,
  //     groups: {
  //       'Seller Group': infraGroupReturn,
  //       'Financial Services Group': infraGroupReturn,
  //       'To C Group': infraGroupReturn,
  //       'Supply Chain Group': infraGroupReturn,
  //       'Infrastructure Team': infraGroupReturn,
  //       'Client Group': infraGroupReturn,
  //       Banking: infraGroupReturn,
  //       'Data Science Group': infraGroupReturn
  //     }
  //   })
  //   expect(result).toEqual(infraReturn)
  // })
  // it('auth test, isManager or AM', async () => {
  //   isRBAC = false
  //   authUser.isManager = true
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let managerReturn = cloneDeep(infraBaseReturn)
  //   managerReturn = booleanMerge(
  //     {
  //       ...managerGlobalReturn,
  //       groups: {
  //         'Infrastructure Team': managerGroupReturn
  //       }
  //     },
  //     managerReturn
  //   )
  //   expect(result).toEqual(managerReturn)
  // })
  // it('auth test, isQA', async () => {
  //   isRBAC = false
  //   authUser.isQA = true
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let qaReturn = cloneDeep(infraBaseReturn)
  //   qaReturn = booleanMerge(
  //     {
  //       ...whiteUserGlobalReturn,
  //       groups: {
  //         'Infrastructure Team': otherRoleGroupReturn
  //       }
  //     },
  //     qaReturn
  //   )
  //   expect(result).toEqual(qaReturn)
  // })
  // it('auth test, isWhite', async () => {
  //   isRBAC = false
  //   authUser.isWhite = true
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let whiteReturn = cloneDeep(infraBaseReturn)
  //   whiteReturn = booleanMerge(whiteUserGlobalReturn, whiteReturn)
  //   expect(result).toEqual(whiteReturn)
  // })
  // it('auth test, user with two roles', async () => {
  //   isRBAC = false
  //   authUser.isWhite = true
  //   authUser.isManager = true
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let twoRolesReturn = cloneDeep(infraBaseReturn)
  //   twoRolesReturn = booleanMerge(
  //     {
  //       ...managerGlobalReturn,
  //       groups: {
  //         'Infrastructure Team': managerGroupReturn
  //       }
  //     },
  //     twoRolesReturn
  //   )
  //   expect(result).toEqual(twoRolesReturn)
  // })
  // it('auth test, CODE_FREEZE_ADMINS user', async () => {
  //   isRBAC = false
  //   authUser.isWhite = true
  //   authUser.isManager = true
  //   authUser.email = 'fei.hou@shopee.com'
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let managerReturn = cloneDeep(infraBaseReturn)
  //   managerReturn = booleanMerge(
  //     {
  //       ...infraAdminUserGlobalReturn,
  //       groups: {
  //         'Infrastructure Team': codeFreezeGroupReturn
  //       }
  //     },
  //     managerReturn
  //   )
  //   expect(result).toEqual(managerReturn)
  // })
  // it('auth test, normal user, other group', async () => {
  //   isRBAC = false
  //   authUser.group = 'Seller Group'
  //   const result = await service.getRbacUserByAuthUser(authUser)
  //   let normalUserReturn = cloneDeep(baseReturn)
  //   normalUserReturn = booleanMerge(
  //     {
  //       ...othersGlobalReturn,
  //       groups: {
  //         'Seller Group': includedGroupReturn
  //       }
  //     },
  //     normalUserReturn
  //   )
  //   expect(result).toEqual(normalUserReturn)
  // })
})

import { IJWTPayLoad, IRoleBinding } from 'common/interfaces/authService.interface'

export interface IRbacUser extends IJWTPayLoad {
  roles: IRoleBinding[]
}

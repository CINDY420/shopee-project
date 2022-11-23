import { Injectable } from '@nestjs/common'
import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import { checkIfAssistantManagerByPosition, checkIfManagerByPosition } from 'common/helpers/user'
import { ESService } from 'common/modules/es/es.service'
import { IDepartment } from './entities/department.entity'
import { IUser, IWhiteListUser } from './entities/user.entity'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name)

  constructor(private eSService: ESService) {}

  async getUserWithEmail(email: string): Promise<IUser> {
    return this.eSService.termQueryFirst<IUser>(ESIndex.USER, 'email', email)
  }

  async getUserDepartmentPathWithID(id: number): Promise<Array<IDepartment>> {
    const path: Array<IDepartment> = []
    const departmentMap = {}

    const allDepartments = await this.getAllOfDepartments()
    allDepartments.forEach((department) => {
      departmentMap[department.id] = department
    })

    let currentDepartment = departmentMap[id]
    if (!currentDepartment) {
      this.logger.error(`Missing department for ${id}`)
      return path
    }

    path.push(currentDepartment)
    while (currentDepartment.parentid) {
      currentDepartment = departmentMap[currentDepartment.parentid]
      path.push(currentDepartment)
      if (!currentDepartment) {
        this.logger.error(`Missing department for ${currentDepartment.parentid}`)
        break
      }
    }

    return path
  }

  async getAllOfDepartments(): Promise<Array<IDepartment>> {
    const { total, documents } = await this.eSService.matchAll<IDepartment>(
      ESIndex.USER_DEPARTMENT,
      ES_MAX_SEARCH_COUNT
    )
    this.logger.debug(`Get departments total is ${total}`)
    return documents
  }

  async getAllWhiteListUsers(): Promise<Array<IWhiteListUser>> {
    const { total, documents } = await this.eSService.matchAll<IWhiteListUser>(
      ESIndex.USER_WHITE_LIST,
      ES_MAX_SEARCH_COUNT
    )
    this.logger.debug(`Get whitelist user total is ${total}`)
    return documents
  }

  async getUserDepartmentLeaders(mainDepartmentID: number): Promise<Array<IUser>> {
    const { documents } = await this.eSService.termQueryAll<IUser>(
      ESIndex.USER,
      'main_department',
      mainDepartmentID,
      ES_MAX_SEARCH_COUNT
    )
    return documents.filter(
      ({ position, role }) =>
        checkIfManagerByPosition(position) ||
        checkIfAssistantManagerByPosition(position) ||
        checkIfManagerByPosition(role) ||
        checkIfAssistantManagerByPosition(role)
    )
  }
}

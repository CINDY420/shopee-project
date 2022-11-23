import { SetMetadata } from '@nestjs/common'
import { ESIndex } from 'common/constants/es'

interface IEsQueryItem {
  queryKey: string // es 查询里面的参数
  dataIndex: string // 你需要的值的位置在API参数的哪里
  position: 'query' | 'params' | 'body'
}

interface IBaseProps {
  esIndex: ESIndex
  secondEsIndex?: string // 要到两个接口里面去校验
  esBooleanQueryItems: IEsQueryItem[]
}

interface IUpdateProps extends IBaseProps {
  operation: 'update'
  validator: (updateData, esData, esDataSecond?) => boolean
}

interface ICreateOrDeleteProps extends IBaseProps {
  operation: 'create' | 'delete'
}

type IProps = IUpdateProps | ICreateOrDeleteProps

export const EsBooleanSync = (property: IProps) => SetMetadata('esBooleanSync', property)

import { SetMetadata } from '@nestjs/common'
import { ESIndex } from 'common/constants/es'

interface IEsContext {
  index: ESIndex
  key: string
}

interface IRequestContext {
  key: string
  position: 'query' | 'params' | 'body'
}

interface IBaseProps {
  esContext: IEsContext
  reqContext: IRequestContext
}

interface IUpdateProps extends IBaseProps {
  operation: 'update'
  validator: (updateData, esData) => boolean
}

interface ICreateOrDeleteProps extends IBaseProps {
  operation: 'create' | 'delete'
}

type IProps = IUpdateProps | ICreateOrDeleteProps

export const EsSync = (property: IProps) => SetMetadata('esSync', property)

import fs from 'fs-extra'
import path from 'path'
import * as vscode from 'vscode'
import mustache from 'mustache'
import prettier from 'prettier'
import { writeFile, mkdir} from 'fs/promises'
import { existsSync } from 'fs'
import { tableTemplate } from '../../templates/table'
import { tableStyleTemplate } from '../../templates/tableStyle'
import { useTableTemplate } from '../../templates/useTable'
import { tablePropsTemplate } from '../../templates/tableProps'
import { constantsTemplate } from '../../templates/constants'
import { capitalizeString, decapitalizeString } from '../util/formatString'

const currentlyOpenTabfilePath = vscode.workspace.workspaceFolders?.[0].uri.path ?? ''
const testFolder = path.join(currentlyOpenTabfilePath, 'src/swagger-api/apiDetail')
const generateTableFolder = path.join(currentlyOpenTabfilePath, 'src/generated-tables')

export const getSourceData = () => {
  return new Promise((resolve) => {
    fs.readFile(`${testFolder}/apiDetail.json`, 'utf8', function (err, data) {
      resolve(JSON.parse(data))
    });
  })
}

const prettierFileContent = (content: string) => {
  return prettier.format(content, {
    printWidth: 100,
    tabWidth: 2,
    parser: 'typescript',
    trailingComma: 'none',
    semi: false,
    singleQuote: true,
    jsxSingleQuote: true,
  })
}

const generateFileContent = async (
  template: string,
  sourceDatas: unknown[],
  others?: any
) => {
  const content = mustache.render(template, {
    contents: sourceDatas,
    ...others
  })
  return prettierFileContent(content)
}

const createFile = async (dirPath: string, fileName: string, content: string) => {
  const filePath = `${dirPath}/${fileName}`
  const utilPath = path.resolve(generateTableFolder, `./util`)
  try {
    if(dirPath === utilPath && existsSync(utilPath)) {
      return
    }
    if (dirPath && !existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }
    await writeFile(filePath, content)
  } catch (error: any) {
    throw new SyntaxError(`Error in create new file ---- ${error}`)
  }
}

interface IFormValueProps {
  selectedKey: string
  order?: boolean
  filter?: boolean
  type?: string
  filterValues?: string[] | string
  filterApiPath?: any
}

interface IGenerateCodeProps {
  columns: string[], 
  apiName: string, 
  request: {
    params: any
    defaultQueries: any
    extraQueries: any
  }, 
  rowKey: string, 
  actions: string[], 
  moreActions: string[], 
  formValue: IFormValueProps[], 
  selectedSearchBy: string[] 
}
export const generateCode = async ({
  columns, apiName, request, rowKey, actions, moreActions, formValue, selectedSearchBy }: IGenerateCodeProps
) => {
  // apiName: AccountControllerListGlobalUsers
  const { params, defaultQueries, extraQueries } = request
  const formattedApiName = `${apiName.split('List')[1].slice(0, -1)}` // GlobalUser
  const itemName = `I${formattedApiName}` // IGlobalUser
  const controller = apiName.split('Controller')[0] // Account
  const responseName = `I${apiName.split('Controller')[1]}Response` // IListGlobalUsersResponse
  const fetchName = decapitalizeString(apiName) // accountControllerListGlobalUsers
  const tableApiFolder = path.resolve(generateTableFolder, `./${controller}/${formattedApiName}Table`)
  const tableUtilFolder = path.resolve(generateTableFolder, `./util`)

  const controllerFetchGroup: {controller: string, fetches: string[]}[] = []
  controllerFetchGroup.push({
    controller: controller,
    fetches: [fetchName]
  })

  // [ {global: [env, az] }]
  const newColumns = columns.map(path => {
    const pathArray = path.split('.')
    const title = pathArray.reduce((acc, curr) => {
      return acc + capitalizeString(curr)
    }, '')
    const selectedKey = formValue.find(item => item.selectedKey === path)?.selectedKey ?? ''
    const filterValues = formValue.find(item => item.selectedKey === path)?.filterValues
    const filterApiPath = formValue.find(item => item.selectedKey === path)?.filterApiPath
    const filterOptionFetch = typeof filterValues === 'string' ? `${decapitalizeString(filterValues)}` : undefined
    const filterOptionFetchController = typeof filterValues === 'string' ? filterValues?.split('Controller')[0] : undefined

    if (filterOptionFetch && filterOptionFetchController) {
      const index = controllerFetchGroup.findIndex(each => each.controller === filterOptionFetchController)
      if (index > 0) {
        const obj = controllerFetchGroup[index]
        if (!obj.fetches.includes(filterOptionFetch)) {
          obj.fetches.push(filterOptionFetch)
        }
        controllerFetchGroup[index] = {...obj}
      } else {
        const obj = { controller: filterOptionFetchController, fetches: [filterOptionFetch] }
        controllerFetchGroup.push({...obj})
      }
    }
    return {
      title,
      dataIndex: path,
      key: path,
      orderable: formValue.find(item => item.selectedKey === path)?.order,
      filterable: formValue.find(item => item.selectedKey === path)?.filter,
      fixedFilterEnum: `I${capitalizeString(selectedKey)}Filter`,
      isFixed: formValue.find(item => item.selectedKey === path)?.type === 'Fixed',
      isFromProps: formValue.find(item => item.selectedKey === path)?.type === 'From Props',
      isFromApi: formValue.find(item => item.selectedKey === path)?.type === 'From API',
      isEnumerate: formValue.find(item => item.selectedKey === path)?.type === 'Enumerate',
      filterOption: `${selectedKey}FilterOptions`,
      capitalizedFilterOption: `${capitalizeString(selectedKey)}FilterOptions`,
      filterOptionFetch,
      filterOptionFetchController,
      filterApiPath
    }
  })

  const isFilterOptionFromApi = formValue.some(each => each.filterApiPath)
  const hasFilterValues = formValue.some(each => each.filterValues?.length && each.filterValues?.length > 0)
  const filterValues = formValue.filter(each => Array.isArray(each.filterValues)).map(each => {
    return {
      name: `I${capitalizeString(each.selectedKey)}Filter`,
      data: Array.isArray(each?.filterValues) ? each?.filterValues?.map(item => {
        return {
          key: item.toUpperCase(),
          value: item.toLowerCase()
        }
      }) : undefined
    }
  })

  const obj = [
    {
      name: 'index.tsx',
      folder: tableApiFolder,
      content: await generateFileContent(
        tableTemplate,
        newColumns,
        {
          formattedApiName,
          rowKey,
          fetchName,
          controller,
          itemName,
          responseName,
          defaultQueries,
          extraQueries,
          params,
          actions,
          moreActions,
          hasActions: actions.length !== 0,
          hasMoreActions: moreActions.length !== 0,
          hasFilterValues,
          filterValues,
          hasSearchBy: selectedSearchBy.length !== 0,
          selectedSearchBy: selectedSearchBy.map(each => {
            return {
              capital: each.toUpperCase(),
              value: each.toLowerCase()
            }
          }),
          isFilterOptionFromApi,
          controllerFetchGroup,
        }
      )
    },
    {
      name: 'style.ts',
      folder: tableApiFolder,
      content: await generateFileContent(
        tableStyleTemplate,
        columns,
      )
    },
    {
      name: 'useTable.ts',
      folder: tableUtilFolder,
      content: await generateFileContent(
        useTableTemplate,
        columns,
      )
    },
    {
      name: 'tableProps.ts',
      folder: tableUtilFolder,
      content: await generateFileContent(
        tablePropsTemplate,
        columns,
      )
    },
    {
      name: 'constants.ts',
      folder: tableUtilFolder,
      content: await generateFileContent(
        constantsTemplate,
        columns,
      )
    }
  ]

  obj.forEach(async ({ name, folder, content }) => {
    await createFile(folder, name, content)
  })
}

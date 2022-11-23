import * as React from 'react'
import { Tooltip, Pagination } from 'infrad'
import { useRecoilValue } from 'recoil'

import { Card } from 'common-styles/cardWrapper'
import { VerticalDivider } from 'common-styles/divider'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { selectedClusterIngress } from 'states/gatewayState/ingress'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { getSearchUrlParam } from 'helpers/queryParams'

import {
  Title,
  StyledSelect,
  StyledSearchOutlined,
  SearchBox,
  IngressNameWrapper,
  NameWrapper,
  Annotations,
  StyledInfoCircleOutlined,
  StyledTable,
  PaginationWrapper
} from './style'

import { IIngresses, IAnnotations } from 'api/types/application/ingress'
import { ingressesControllerGetClusterIngresses } from 'swagger-api/v3/apis/Ingresses'

const buildAnnotationsList = (annotations: IAnnotations[]) => {
  return annotations.reduce((prev, annotation) => {
    const { key, value } = annotation
    return prev.concat([`${key}: ${value}`])
  }, [])
}

const defaultPath = {
  pathName: '-',
  pathType: '-',
  serviceName: '-',
  servicePort: '-'
}

const buildIngressListData = (ingresses: IIngresses[]) => {
  return ingresses.reduce((previous, ingress) => {
    const { hosts, annotations, name: ingressName } = ingress
    const annotationsList = buildAnnotationsList(annotations)
    const hostsList = hosts.reduce((prev, host) => {
      const { paths, name: hostName } = host
      const pathsList = paths.map(path => {
        return {
          ingressName,
          hostName,
          annotations: annotationsList,
          pathsLength: 0,
          ...path
        }
      })
      if (!paths.length) {
        pathsList.push({
          ingressName,
          hostName,
          annotations: annotationsList,
          pathsLength: 0,
          ...defaultPath
        })
      }
      if (pathsList[0]) {
        pathsList[0].pathsLength = pathsList.length
      }
      return prev.concat(pathsList)
    }, [])
    if (!hosts.length) {
      hostsList.push({
        ingressName,
        hostName: '-',
        annotations: annotationsList,
        pathsLength: 1,
        ...defaultPath
      })
    }
    if (hostsList[0]) {
      hostsList[0].ingressLength = hostsList.length
    }
    return previous.concat(hostsList)
  }, [])
}

const IngressList: React.FC = props => {
  const { name: clusterName } = useRecoilValue(selectedClusterIngress)

  const [searchVal, setSearchVal] = React.useState([])
  const [ingresses, setIngresses] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [current, setCurrent] = React.useState(1)
  const [currentPageSize, setCurrentPageSize] = React.useState(10)

  const listIngressesFnWithResource = React.useCallback(
    args => {
      const searchBy = getSearchUrlParam(searchVal)

      return ingressesControllerGetClusterIngresses({
        clusterName,
        ...args,
        searchBy: searchBy ? `${searchBy}` : ''
      })
    },
    [clusterName, searchVal]
  )
  const [listIngressesState, listIngressesFn] = useAsyncIntervalFn<any>(listIngressesFnWithResource)
  const { handleTableChange, refresh } = useAntdTable({ fetchFn: listIngressesFn })

  const columns = [
    {
      title: 'Ingress Name',
      dataIndex: 'ingressName',
      key: 'ingressName',
      render: (value, row) => {
        const { ingressLength, annotations } = row

        const obj = {
          children: (
            <IngressNameWrapper>
              <NameWrapper>{value}</NameWrapper>
              <Tooltip
                placement='topLeft'
                title={
                  <div>
                    Annotations:
                    {annotations.length
                      ? annotations.map(annotation => <div key={annotation}>{`${annotation};`}</div>)
                      : ' none'}
                  </div>
                }
              >
                <Annotations>
                  <StyledInfoCircleOutlined />
                  View Annotations
                </Annotations>
              </Tooltip>
            </IngressNameWrapper>
          ),
          props: {
            rowSpan: 0
          }
        }

        if (ingressLength) {
          obj.props.rowSpan = ingressLength
        }
        return obj
      }
    },
    {
      title: 'Host',
      dataIndex: 'hostName',
      key: 'hostName',
      render: (value, row) => {
        const obj = {
          children: value,
          props: {
            rowSpan: 0
          }
        }
        const { pathsLength } = row
        if (pathsLength) {
          obj.props.rowSpan = pathsLength
        }
        return obj
      }
    },
    {
      title: 'Path',
      dataIndex: 'pathName',
      key: 'pathName',
      render: value => {
        return value === '' ? '-' : value
      }
    },
    {
      title: 'Path Type',
      dataIndex: 'pathType',
      key: 'pathType',
      render: value => {
        return value === '' ? '-' : value
      }
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: value => {
        return value === '' ? '-' : value
      }
    },
    {
      title: 'Service Port',
      dataIndex: 'servicePort',
      key: 'servicePort',
      render: value => {
        return value === '' ? '-' : value
      }
    }
  ]

  const handleChange = value => {
    setCurrent(1)
    setSearchVal(value)
  }

  React.useEffect(() => {
    if (listIngressesState.value) {
      const { ingresses, totalCount } = listIngressesState.value
      setIngresses(ingresses)
      setTotalCount(totalCount)
    }
  }, [listIngressesState.value])

  React.useEffect(() => {
    refresh()
  }, [clusterName, searchVal, refresh])

  return (
    <Card>
      <Title>Ingress List</Title>
      <VerticalDivider size='24px' />

      <SearchBox>
        <StyledSelect
          mode='tags'
          placeholder='Search...'
          onChange={handleChange}
          dropdownStyle={{ display: 'none' }}
        ></StyledSelect>
        <StyledSearchOutlined />
      </SearchBox>

      <VerticalDivider size='24px' />
      <StyledTable
        bordered
        columns={columns}
        loading={listIngressesState.loading}
        dataSource={buildIngressListData(ingresses)}
        onChange={handleTableChange}
        pagination={false}
      />
      {totalCount ? (
        <PaginationWrapper>
          <Pagination
            onChange={(page, pageSize) => {
              const currentPage = currentPageSize === pageSize ? page : 1
              setCurrent(currentPage)
              setCurrentPageSize(pageSize)
              handleTableChange({ pageSize, current: currentPage }, {}, {}, null)
            }}
            current={current}
            total={totalCount}
            size={TABLE_PAGINATION_OPTION.size}
            showSizeChanger={TABLE_PAGINATION_OPTION.showSizeChanger}
            pageSizeOptions={TABLE_PAGINATION_OPTION.pageSizeOptions}
            showTotal={TABLE_PAGINATION_OPTION.showTotal}
          />
        </PaginationWrapper>
      ) : null}
    </Card>
  )
}

export default IngressList

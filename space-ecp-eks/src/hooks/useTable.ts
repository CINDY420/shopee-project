import React from 'react'
import { useAntdTable, useInterval } from 'ahooks'
import { Data, Params, AntdTableOptions, Service } from 'ahooks/lib/useAntdTable/types'
import { TableProps } from 'infrad/lib/table'

interface IUseTableOptions<TData extends Data, TParams extends Params>
  extends AntdTableOptions<TData, TParams> {
  reloadRate?: number
}

export const useTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: IUseTableOptions<TData, TParams>,
) => {
  const { reloadRate, ...restOptions } = options
  const { refreshDeps } = restOptions
  const [reloadLoading, setReloadLoading] = React.useState(false)

  const result = useAntdTable(service, restOptions)
  const { tableProps, loading, refreshAsync, refresh, run, runAsync } = result
  const { onChange } = tableProps

  const refreshAsyncAndChangeReloadLoading = async () => {
    setReloadLoading(false)
    return await refreshAsync()
  }

  const refreshAndChangeReloadLoading = () => {
    setReloadLoading(false)
    return refresh()
  }

  const runAndChangeReloadLoading = (...params: TParams) => {
    setReloadLoading(false)
    return run(...params)
  }

  const runAsyncAndChangeReloadLoading = async (...params: TParams) => {
    setReloadLoading(false)
    return await runAsync(...params)
  }

  useInterval(async () => {
    if (!loading) {
      setReloadLoading(true)
      await refreshAsync()
      setReloadLoading(false)
    }
  }, reloadRate)

  React.useEffect(() => {
    setReloadLoading(false)
  }, refreshDeps)

  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    setReloadLoading(false)
    onChange(pagination, filters, sorter)
  }

  return {
    ...result,
    refreshAsync: refreshAsyncAndChangeReloadLoading,
    refresh: refreshAndChangeReloadLoading,
    run: runAndChangeReloadLoading,
    runAsync: runAsyncAndChangeReloadLoading,
    tableProps: {
      ...tableProps,
      onChange: handleTableChange,
      loading: !reloadLoading && loading,
    },
    loading: !reloadLoading && loading,
  }
}

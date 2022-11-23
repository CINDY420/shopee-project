export const useTableTemplate = `import { useAntdTable, useInterval } from 'ahooks'
import type { AntdTableOptions, Data, Params, Service } from 'ahooks/lib/useAntdTable/types'
import { TableProps } from 'infrad/lib/table'
import React from 'react'

const useTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: AntdTableOptions<TData, TParams> & { reloadRate?: number },
) => {
  const { reloadRate, ...restOptions } = options || {}
  const { refreshDeps } = restOptions
  const [reloadLoading, setReloadLoading] = React.useState(false)

  const result = useAntdTable(service, restOptions)
  const { refreshAsync, refresh, run, runAsync, tableProps, loading } = result
  const { onChange } = tableProps

  const refreshAsyncAndChangeReloadLoading = async () => {
    setReloadLoading(false)
    await refreshAsync()
  }

  const refreshAndChangeReloadLoading = () => {
    setReloadLoading(false)
    refresh()
  }

  const runAndChangeReloadLoading = (...params: TParams) => {
    setReloadLoading(false)
    run(...params)
  }

  const runAsyncAndChangeReloadLoading = async (...params: TParams) => {
    setReloadLoading(false)
    await runAsync(...params)
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
    runAsync: runAsyncAndChangeReloadLoading,
    run: runAndChangeReloadLoading,
    tableProps: {
      ...tableProps,
      onChange: handleTableChange,
      loading: !reloadLoading && loading,
    },
    loading: !reloadLoading && loading,
  }
}

export default useTable
`
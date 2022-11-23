import * as React from 'react'
import { Divider } from 'infrad'
import { SearchOutlined, CloseCircleFilled } from 'infra-design-icons'

import useAsyncFn from 'hooks/useAsyncFn'
import { asyncDebounce } from 'helpers/functionUtils'
import { globalControllerGetResources } from 'swagger-api/v3/apis/Global'
import { IIResourceResponse } from 'swagger-api/v3/models'

import VirtualList from './VirtualList'

import { Root, StyledInput, ListContainer, ListTitle, StyledSpin } from './style'

export enum RESOURCE_TYPES {
  APPLICATIONS = 'applications',
  PODS = 'pods'
}

const initialValues: IIResourceResponse = {
  applications: [],
  pods: []
}

const HeaderSearch: React.FC = () => {
  const [value, setValue] = React.useState<string>('')
  const [result, setResult] = React.useState(initialValues)
  const [isFocus, setIsFocus] = React.useState<boolean>(false)
  const [isEmpty, setIsEmpty] = React.useState<boolean>(true)

  const [fetchResourcesState, fetchResourceFn] = useAsyncFn(globalControllerGetResources)

  const throttledFetch = React.useMemo(() => asyncDebounce(fetchResourceFn, 300), [fetchResourceFn])

  React.useEffect(() => {
    let cancel = false
    if (value) {
      throttledFetch({ searchBy: value }).then((data: IIResourceResponse) => {
        if (data && !cancel) {
          setResult(data)
          setIsEmpty(false)
        }
      })
    }

    return () => (cancel = true)
  }, [throttledFetch, value])

  React.useEffect(() => {
    if (!value) {
      setIsEmpty(true)
    }
  }, [value])

  const renderList = React.useCallback(
    (name, resources) => (
      <>
        {resources.length ? (
          <>
            {name === RESOURCE_TYPES.PODS && <Divider style={{ margin: 0 }} />}
            <ListTitle>{name}</ListTitle>
            <VirtualList type={name} resources={resources} />
          </>
        ) : null}
      </>
    ),
    []
  )

  return (
    <Root onBlur={() => setIsFocus(false)}>
      <StyledInput
        onFocus={() => setIsFocus(true)}
        value={value}
        onChange={e => {
          const value = e.target.value
          setValue(value)
          setIsFocus(true)
        }}
        placeholder='Search Application/Pod IP...'
        suffix={
          value ? (
            <CloseCircleFilled
              style={{ color: 'white' }}
              onClick={() => {
                setValue('')
                setIsFocus(false)
              }}
            />
          ) : (
            <SearchOutlined style={{ color: 'white' }} />
          )
        }
      />
      <ListContainer open={isFocus && !isEmpty}>
        {fetchResourcesState.loading ? (
          <StyledSpin />
        ) : (
          <>
            {renderList(RESOURCE_TYPES.APPLICATIONS, result.applications)}
            {renderList(RESOURCE_TYPES.PODS, result.pods)}
          </>
        )}
      </ListContainer>
    </Root>
  )
}

export default HeaderSearch

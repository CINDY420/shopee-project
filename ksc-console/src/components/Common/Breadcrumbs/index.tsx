import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Overlay, { IOverlayProps } from './Overlay'
import * as ramda from 'ramda'
import useGeneratePath from 'hooks/useGeneratePath'
import { StyledBreadcrumb } from './style'

export interface ICrumbTreeProps {
  crumbName: string
  route: string
  paramsKey: string
  overlayDropdownLists?: any
  overlay?: ((props: IOverlayProps) => React.ReactElement) | boolean
  currentDisplayName?: string
}

interface IBreadcrumbsProps {
  crumbTree: ICrumbTreeProps[]
  routes: Array<any>
}

function findBreadNames(
  originData: ICrumbTreeProps[],
  queryParams: Record<string, string | undefined> | undefined,
  currentOverlayNames: Record<string, string>,
) {
  const result: Record<string, string> = {}
  if (!queryParams) return result
  for (const i in queryParams) {
    if (!queryParams[i]) continue

    if (!currentOverlayNames[i]) {
      const breadcrumbItems = originData.filter((item) => item.paramsKey === i)
      if (breadcrumbItems && breadcrumbItems.length > 0) {
        const overlayDropdownLists = breadcrumbItems[0].overlayDropdownLists
        const currentBreadDatas = overlayDropdownLists.filter((item) => item.id === queryParams[i])
        if (currentBreadDatas && currentBreadDatas.length > 0)
          result[i] = currentBreadDatas[0]?.name
      }
    }
  }
  return result
}

const getBreadcrumbTitle = (item: ICrumbTreeProps, currentOverlayNames: Record<string, string>) => {
  const { overlay, crumbName, paramsKey, currentDisplayName } = item
  if (overlay) return `${crumbName}: ${currentOverlayNames[paramsKey]}`
  if (currentDisplayName) return `${crumbName}: ${currentDisplayName}`
  return crumbName
}

const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({ crumbTree, routes }) => {
  const navigate = useNavigate()
  const getPath = useGeneratePath(routes)
  const [isBreadcrumbVisible, setIsBreadcrumbVisible] = useState(false)
  const [currentOverlayNames, setCurrentOverlayNames] = useState<Record<string, string>>({})

  const renderOverlay = (crumItem: ICrumbTreeProps) => {
    if (crumItem.overlay === undefined || crumItem.overlay === true)
      return (
        <Overlay
          crumbName={crumItem.crumbName}
          dropdownLists={crumItem.overlayDropdownLists}
          onSelect={(item) => handleOverlayClick(crumItem, item)}
        />
      )

    if (crumItem.overlay === false) return undefined
    return <crumItem.overlay />
  }

  const handleOverlayClick = (breadcrumbItem: ICrumbTreeProps, item) => {
    const path = getPath(breadcrumbItem.route, { [breadcrumbItem.paramsKey]: item.id })
    setCurrentOverlayNames({ ...currentOverlayNames, [breadcrumbItem.paramsKey]: item.name })
    navigate(path)
  }

  const handleBreadcrumbClick = (item: ICrumbTreeProps) => {
    const path = getPath(item.route)
    navigate(path)
  }

  const queryParams = useParams()
  const breadNames = findBreadNames(crumbTree, queryParams, currentOverlayNames)
  if (!ramda.isEmpty(breadNames)) setCurrentOverlayNames({ ...currentOverlayNames, ...breadNames })

  const checkIfShowBreadcrumb = useCallback(
    (crumbTree: ICrumbTreeProps[]) => {
      const isVisible = crumbTree.every(
        (item) => !item.overlay || (item.overlay && currentOverlayNames[item.paramsKey]),
      )
      setIsBreadcrumbVisible(isVisible)
    },
    [currentOverlayNames],
  )

  useEffect(() => {
    checkIfShowBreadcrumb(crumbTree)
  }, [crumbTree, checkIfShowBreadcrumb])

  return (
    <StyledBreadcrumb visible={isBreadcrumbVisible ? 'visible' : 'hidden'}>
      {crumbTree?.map((item) => (
        <StyledBreadcrumb.Item key={item.crumbName} overlay={renderOverlay(item)}>
          <span onClick={() => handleBreadcrumbClick(item)}>
            {getBreadcrumbTitle(item, currentOverlayNames)}
          </span>
        </StyledBreadcrumb.Item>
      ))}
    </StyledBreadcrumb>
  )
}

export default Breadcrumbs

import * as React from 'react'
import Breadcrumbs from 'components/Common/BreadcrumbsBanner/Breadcrumbs'
import useLocationChange from 'hooks/routes/useLocationChange'
import { checkIfRouteMatchPath } from 'helpers/routes'

import { Root, Crumb, Name } from './style'

interface ICrumb {
  key?: string
  desc?: string
  onClick?: (param: any) => void
  overlay?: (props: any) => React.ReactElement
  isHideResourceName?: boolean
  nameKey?: string
}

interface IRouteCrumbsNode {
  route: string
  children?: Array<IRouteCrumbsNode>
  extendedCrumbs: string | Array<string>
}

type IRouteCrumbsTree = Array<IRouteCrumbsNode>

/**
 * This component is used for creating bread crumbs in K8S system
 */
export interface IBreadcrumbsBannerProps {
  /** Route jump path when user click the crumb */
  crumbLookup: {
    [crumbKey: string]: ICrumb
  }
  /** Current selected crumb names */
  crumbResourceLookup: {
    [crumbKey: string]: {
      [key: string]: any
      name?: string
    }
  }
  /** Route crumbs tree definition */
  routeCrumbsTree: IRouteCrumbsTree
}

type IActiveCrumb = [string, ICrumb]
type IActiveCrumbs = Array<IActiveCrumb>

const findTheExactMatchRouteCrumbsNodePath = (
  pathname,
  routeCrumbsArray: Array<IRouteCrumbsNode>
): Array<IRouteCrumbsNode> => {
  let currentMatchRouteCrumbsNodePath = []

  for (const routeCrumbsNode of routeCrumbsArray) {
    const [match, isExact] = checkIfRouteMatchPath(routeCrumbsNode.route, pathname)

    if (!match) {
      continue
    }

    if (isExact) {
      currentMatchRouteCrumbsNodePath = [routeCrumbsNode]
      break
    }

    if (routeCrumbsNode.children && routeCrumbsNode.children.length) {
      const childPath = findTheExactMatchRouteCrumbsNodePath(pathname, routeCrumbsNode.children)
      if (childPath.length) {
        currentMatchRouteCrumbsNodePath = [routeCrumbsNode, ...childPath]
      } else {
        break
      }
    }
  }

  return currentMatchRouteCrumbsNodePath
}

const BreadcrumbsBanner: React.FC<IBreadcrumbsBannerProps> = ({
  crumbLookup,
  crumbResourceLookup,
  routeCrumbsTree
}) => {
  const [activeCrumbs, setActiveCrumbs] = React.useState<IActiveCrumbs>([])

  const handleLocationChange = React.useCallback(
    location => {
      // TODO, should handle hash change here?
      const { pathname } = location
      const exactMatchRouteCrumbsNodePath = findTheExactMatchRouteCrumbsNodePath(pathname, routeCrumbsTree)
      if (!exactMatchRouteCrumbsNodePath.length) {
        console.error('Oops! can not find match route crumbsNode for ', pathname)
        return
      }

      const activeCrumbKeys = exactMatchRouteCrumbsNodePath.reduce((crumbKeys, node) => {
        return crumbKeys.concat(node.extendedCrumbs)
      }, [])
      const activeCrumbs = activeCrumbKeys.map<IActiveCrumb>(crumbKey => {
        const crumb = crumbLookup[crumbKey]
        if (crumb) {
          return [crumbKey, crumb]
        } else {
          console.error('missing crumb for key: ', crumbKey)
          return [crumbKey, {}]
        }
      })

      setActiveCrumbs(activeCrumbs)
    },
    [routeCrumbsTree, crumbLookup]
  )

  useLocationChange(handleLocationChange)

  return (
    <Root>
      <Breadcrumbs>
        {activeCrumbs.map(
          ([crumbType, { key, desc, onClick, overlay, isHideResourceName, nameKey = 'name' }], index) => {
            const resource = crumbResourceLookup[crumbType]
            const displayName = resource && resource[nameKey]
            const clickable = index !== activeCrumbs.length - 1 && !!onClick

            return displayName || desc ? (
              <Crumb key={key || index}>
                <Name isActive={clickable} onClick={() => clickable && onClick && onClick(resource)}>
                  {desc || null}
                  {isHideResourceName ? '' : displayName}
                </Name>
                {overlay && overlay(resource)}
              </Crumb>
            ) : null
          }
        )}
      </Breadcrumbs>
    </Root>
  )
}

export default BreadcrumbsBanner

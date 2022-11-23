import fetch from 'isomorphic-fetch'
import { getSession } from 'helpers/session'
import { localServer } from 'constants/server'

/**
 * 一、背景：
 * 前端新用户权限申请UX交互需要通过接口的status区分是不是新用户。
 * openapi报错403的2种情况：1、新用户没绑定任何tenant；2、绑定tenant的用户的角色权限设计本来就是没权限。
 * 但实际上openapi对以上2种情况不作区分，统一报错403，也不愿意改。因此需要前端自行判断。
 * 二、方案：
 * 理论上在bff层校验更好，但bff无法解析token，拿不到userId，也就无法请求openapi的GetUser接口。因此只能放在前端实现。
 * 前端需要捕获全局的403，再通过请求getUser判断user roles是不是空，空则是新用户。
 * 三、实现
 * hasRoles方法需要请求getUser判断user roles是不是空，空则是新用户。
 * 但此方法需要catch全局的403，因此需要在helpers/fetch.ts里使用，为了避免循环引用，独立使用isomorphic-fetch发请求。
 */

export const hasRoles = async (): Promise<boolean> => {
  const userSession = getSession()
  const { userId } = userSession
  const userInfoUri = process.env.__IS_LOCAL__
    ? `${localServer}/node-gateway/api/user/${userId}`
    : `/node-gateway/api/user/${userId}`
  const userInfoResponse = await fetch(userInfoUri, {
    method: 'GET',
    // eslint-disable-next-line @typescript-eslint/naming-convention -- http header key
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  const body = await userInfoResponse.json()
  const roles = body?.data?.roles
  return roles?.length > 0
}

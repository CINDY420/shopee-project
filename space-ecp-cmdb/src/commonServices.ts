/*
 * Refer to the doc below for details to using/importing common services
 * https://confluence.shopee.io/display/TD/How+to+use+common+services
 */
import commonServices from '@space/common-services'

const globalServices = commonServices.getGlobalServices()

export const { auth } = globalServices

export const { fetch: authFetch } = globalServices.auth.utils

/*
 * TODO: tiancheng.zhang
 * This map is maintained by SRE, and the doc link is https://confluence.shopee.io/pages/viewpage.action?pageId=1029506551
 * In next version, this will be replaced by openapi
 * {tenantName: {projectName: 'logstore'}}
 */
export const LOG_STORE_MAP = {
  'EGO Training Platform': {
    ego_train: 'ego-training-platform.batch-ego-training-platform-ego-train-live-sg_sg7',
  },
  'Recommend Architecture': {
    rcmd_pdp: 'ego-training-platform-group.batch-recommend-architecture-rcmd-pdp-live-sg_sg7',
    rcmd_shop: 'ego-training-platform-group.batch-recommend-architecture-rcmd-shop-live-sg_sg7',
    release_test:
      'ego-training-platform-group.batch-recommend-architecture-release-test-live-sg_sg7',
    rcmd_cart: 'ego-training-platform-group.batch-recommend-architecture-rcmd-cart-live-sg_sg7',
    rcmd_dd: 'ego-training-platform-group.batch-recommend-architecture-rcmd-dd-live-sg_sg7',
  },
}

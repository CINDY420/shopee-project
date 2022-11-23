export enum AUTH_STATUS {
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export enum AUTH_TYPE {
  TERMINAL = 'TERMINAL',
  CHANGE_ROLE = 'CHANGE_ROLE',
  ADD_ROLE = 'ADD_ROLE'
}

export enum AUTH_TYPE_WORDS {
  TERMINAL = 'Terminal Requests',
  CHANGE_ROLE = '变更权限',
  ADD_ROLE = '新增权限'
}

enum AUTH_GROUP {
  INFRA = 'Infrastructure Team',
  SELLER = 'Seller Group',
  SUPPLY_CHAIN = 'Supply Chain Group',
  TO_C = 'To C Group',
  FINANCIAL = 'Financial Services Group',
  BANKING = 'Banking',
  SCIENCE = 'Data Science Group',
  DIGITAL_PURCHASE_AND_LOCAL_SERVICE = 'Digital Purchase And Local Service'
}

export const Groups = {
  'Infra Platform Group': AUTH_GROUP.INFRA,
  'TechOps Group': AUTH_GROUP.INFRA,
  'Seller Group': AUTH_GROUP.SELLER,
  'Supply Chain Group': AUTH_GROUP.SUPPLY_CHAIN,
  'To C Group': AUTH_GROUP.TO_C,
  'MultiMedia Group': AUTH_GROUP.TO_C,
  'Financial Services Group': AUTH_GROUP.FINANCIAL,
  Banking: AUTH_GROUP.BANKING,
  'Data Science Group': AUTH_GROUP.SCIENCE,
  'Digital Purchase And Local Service': AUTH_GROUP.DIGITAL_PURCHASE_AND_LOCAL_SERVICE
}

export const WITH_SRE_GROUP = 'TechOps Group'

export enum ROLES {
  BE = 'BE',
  FE = 'FE',
  QA = 'QA',
  SRE = 'SRE',
  Others = 'Others'
}

export const GroupInfo = {
  [AUTH_GROUP.SELLER]: { id: 142, approver: 'lu.zhong@shopee.com' },
  [AUTH_GROUP.SUPPLY_CHAIN]: { id: 158, approver: 'zepeng.yao@shopee.com' },
  [AUTH_GROUP.TO_C]: { id: 155, approver: 'junlian.liao@shopee.com,yangyang.geng@shopee.com' },
  [AUTH_GROUP.FINANCIAL]: { id: 151, approver: 'xiaoning.li@shopee.com' },
  [AUTH_GROUP.INFRA]: { id: 191, approver: 'guiqin.huang@shopee.com' },
  [AUTH_GROUP.BANKING]: { id: 436, approver: 'guanghui.cao@shopee.com,qiancheng.yang@shopee.com,lei.yang@shopee.com' },
  [AUTH_GROUP.SCIENCE]: { id: 1234, approver: 'liangkui.zhou@shopee.com' },
  [AUTH_GROUP.DIGITAL_PURCHASE_AND_LOCAL_SERVICE]: {
    id: 1235,
    approver: 'xiaoning.li@shopee.com,weisheng.ma@shopee.com,wenlong.an@shopee.com,ting.xu@shopee.com'
  }
}

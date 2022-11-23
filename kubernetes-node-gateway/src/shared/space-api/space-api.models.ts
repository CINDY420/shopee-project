export interface IUicUser {
  name: string
  email: string
  full_name: string
  given_name: string
  family_name: string
  locale: string
  username: string
  is_bot: boolean
  limited: boolean
  description: string
  create_time: string
  update_time: string
  picture: string
  sub: string
}

export interface IGetSpaceTokenResponse {
  user: IUicUser
  token: string
}

export interface ICMDBServiceDataPersonasApp {
  mismatch_app_model: boolean
  missing_app_model: boolean
}

export interface ICMDBServiceDataPersonas {
  app: ICMDBServiceDataPersonasApp
}

export interface ICMDBServiceData {
  has_live_containers: boolean
  has_servers: boolean
  impact: string
  l1_product_line: string
  l2_product_line: string
  l3_product_line: string
  personas: ICMDBServiceDataPersonas
  product_line: string
  sub_product_line: string
}

export interface ICMDBService {
  service_id: number
  service_name: string
  git_link: string
  data: ICMDBServiceData
  updated_by: string
  service_owners: string[]
  is_protected: boolean
  enabled: boolean
  created_at: number
  updated_at: number
}

export interface IGetServiceNameByIdentifierResponse {
  service: ICMDBService
}

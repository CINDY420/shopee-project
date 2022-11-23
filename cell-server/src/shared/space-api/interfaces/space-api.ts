interface IUICLabel {
  label_id: number
  label_name: string
  team_id: number
  created_at: number
  updated_at: number
  color: string
  members: string[]
}

interface IUICTeam {
  team_id: number
  team_name: string
  description: string
  created_at: number
  updated_at: number
  team_type: number
  hide: boolean
  path_names: string[]
  ancestor_ids: string[]
  labels: IUICLabel[]
}

interface IUICUser {
  blocked: boolean
  enabled: boolean
  is_bot: boolean
  limited: boolean
  is_intern: boolean
  user_id: number
  email: string
  org_hierarchy: string
  reporting_manager_email: string
  full_name: string
  profile_pic: string
  username: string
  created_at: number
  update_at: number
  hris_email: string
  report_line: string
  subordinate: string
  teams: IUICTeam[]
}

export interface IGetUserProfileResponse {
  users: IUICUser[]
  total_size: number
}

interface IUICUserInfo {
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

export interface IGetUserInfoByTokenResponse {
  user: IUICUserInfo
  token: string
}

export interface ICMDBService {
  service_id: number
  service_name: string
  data: Record<string, unknown>
  updated_by: string
  service_owners: string[]
  enabled: boolean
  created_at: number
  updated_at: number
}

export interface IGetServiceResponse {
  service: ICMDBService
}

export interface ICreateTicketBody {
  service_id?: number
  service_name: string
  service_owners: string[]
  swp_tickets: any
}

export interface ICreateTicketResponse {
  redirect_url: string
  service_tickets: {
    id: number
    service_id: number
    service_ticket_id: number
    ticket_id: number
    template_name: string
    enabled: boolean
    created_at: number
    updated_at: number
    swp_meta_info: {
      id: number
      name: string
      platform: string
      title: string
      phase: string
      phase_type: string
      form_data: {
        service_name: string
        service_owners: string[]
        subject_email: string
        subject_type: string
        subjects: number[]
      }
      applicant_user: string
      assignee_user: string
      assignee_team: string
      reviewers: string[]
      watchers: any[]
      eta: number
      label: {
        be_data: any
        category: string
        extra_data: any
        fe_data: any
        name: string
        template_name: string
        ticket_type: string
      }
      created_at: number
      updated_at: number
    }
  }[]
  total_size: number
}

export interface IGetCheckCodeFreezeResponse {
  version: string
  success: boolean
  business_code: number
  result: {
    lockdown?: boolean
    campaign_notice?: string
    changelog_has_read: boolean
    last_pipelines: any
    campaign_link?: string
    campaign_link_name?: string
  }
}

export interface IGetSWPTicketResponse {
  success: boolean
  version: string
  result: {
    id: number
    name: string
    title: string
    renderer_type: string
    json_schema: string
    ui_schema: string
    form_data: FormData
    eta: number
    assignee_team_id: string
    applicant_user: string
    assignee_user: string
    reviewers: string[]
    reviewers_with_role: {
      email: string
      role: string
      operated: boolean
    }[]
    watchers: any[]
    template_id: number
    workflow_id: number
    phase_id: number
    is_underway: boolean
    phase: string
    phase_type: string
    label: {
      name: string
      template_name: string
      category: string
      ticket_type: string
      fe_data: any
      be_data: any
      extra_data: any
    }
    created_at: number
    updated_at: number
    bundle_meta: any
    executable_transitions: any[]
    fields_to_show: any
    viewable: boolean
  }
  error?: {
    message: string
    traceback: string
    type: string
  }
}

export interface IUpdateDeployPathBody {
  deploy_definition_path: string
  disable_concurrent_builds_job: boolean
  env: string
  service_id: number
}

export interface IUpdateDeployConfigurationBody {
  comment: string
  data: string
  env: string
  service_id: number
}

export interface ICreateFEWorkbenchAppBody {
  app_name: string
  app_desc: string
  git_repo: string
  git_prj_id: string
}

export interface ICreateFEWorkbenchAppResponse {
  is_success: boolean
  message?: string
  data: {
    id: number
  }
}

export interface IImportJenkinsBody {
  app_id: string
  service_id: number
  jobs: Record<string, string>
}

export interface IQuerySWPTicketBody {
  group?: string
  platform: string
  ignore_actions?: boolean
  ignore_finished_tickets?: boolean
  ignore_underway_tickets?: boolean
  title?: any
  phase?: any
  phase_types?: string[]
  assignee_team_id?: any
  user_match?: any
  form_data_match?: any
  label_match?: any
  origin_data_match?: any
  create_time_start?: number
  create_time_end?: number
  eta_start?: number
  eta_end?: number
  order?: any
  page?: number
  page_size?: number
}

export interface ISWPTicket {
  id: number
  name: string
  platform: string
  title: string
  phase: string
  phase_type: string
  form_data: any
  applicant_user: string
  assignee_user: string
  assignee_team: string
  reviewers: string[]
  watchers: any
  is_underway: boolean
  eta: number
  label: any
  executable_transitions: any[]
  viewable: boolean
  created_at: number
  updated_at: number
  stc_ticket_id: string
}

export interface IQuerySWPTicketResponse {
  result: {
    tickets: ISWPTicket[]
    total_count: number
    source: string
  }
}

export interface ICreateSWPTicketBody {
  title: string
  form_data: any
  template_id?: number
  template_name: string
  label?: {
    be_data?: any
    fe_data?: any
  }
  eta?: number
  auto_submit?: boolean
  preset_reviewers?: string[]
  preset_watchers?: string[]
  preset_assignee_user?: string
  preset_assignee_team?: string
  linked_tickets?: Record<string, number[]>
}

export interface ICreateSWPTicketresponse {
  result: ISWPTicket
}
export interface IGetAlbListenerQuery {
  cid?: string
  env?: string
  domain_prefix?: string
  domain_zone?: string
  show_details?: boolean
  multiple_cids?: boolean
  unique_cid_and_env?: boolean
  show_submitted?: boolean
  skip_deep?: boolean
  show_history?: boolean
  fill_rule_count?: boolean
  fill_instance?: boolean
}

interface IGetAlbListenerData {
  cert_name: string
  cid: string
  comment: string
  created_at: number
  deployed_percentage: number
  directives: {
    comment: string
    created_at: number
    id: number
    key: string
    listener_id: number
    updated_at: number
    value: string
  }[]
  distributed_percentage: number
  domain_name: string
  domain_prefix: string
  domain_zone: string
  dynamic_config: {
    domain: string
    env: string
    id: number
    rules: any[]
    directives: {
      allow_list: {
        ips: string[]
        policies: string[]
      }
    }
  }
  enable_http3: boolean
  env: string
  generated_content: string
  id: number
  instances: string[]
  is_cors_allowed: boolean
  is_locked: boolean
  label: string
  link: string
  multiple_cids: boolean
  project_name: string
  release_strategy: string
  rule_count: number
  rules: any[]
  status: string
  ticket_id: string
  updated_at: number
  updated_by: string
}

export interface IGetAlbListenerResponse {
  result: IGetAlbListenerData[]
}

export interface ICreateAlbListenerBody {
  listeners: {
    rules: {
      match_type: string
      match_path: string
      enable_port_80: boolean
      enable_port_443: boolean
      target_type: string
      target_project: string
      target_module: string
      target_name: string
      target_protocol: string
      loadBalancerMethod: string
      directives?: {
        key: string
        value: string
      }[]
    }[]
    comment: string
  }[]
}

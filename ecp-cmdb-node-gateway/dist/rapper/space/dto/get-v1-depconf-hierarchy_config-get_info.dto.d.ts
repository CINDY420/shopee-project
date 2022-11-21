import { ItemEmpty } from '.';
export declare class Item114376 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114373 {
    'canary_stages'?: any[];
    'disable_restart'?: boolean;
    'enable_canary_replacement'?: boolean;
    'in_place'?: boolean;
    'instances_per_agent'?: number;
    'max_surge'?: string;
    'max_unavailable'?: string;
    'reserve_resources'?: boolean;
    'step_down'?: number;
    'strict_in_place'?: boolean;
    'threshold'?: number;
}
export declare class Item114371 {
    'max_instances'?: number;
    'selectors'?: Item114376[];
    'unique_key'?: string;
}
export declare class Item114369 {
    'name'?: string;
    'parameters'?: Item114373;
}
export declare class Item114364 {
    'name'?: string;
    'parameters'?: Item114371;
}
export declare class Item114356 {
    'name'?: string;
    'parameters'?: Item114373;
}
export declare class Item114355 {
    'assignment_policies'?: Item114364[];
    'orchestrator'?: string;
}
export declare class Item114354 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114352 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114347;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114369;
}
export declare class Item114347 {
    'workload_type'?: string;
}
export declare class Item114325 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114347;
    'ecp_cluster_configs'?: Item114352[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114354;
    'scheduler'?: Item114355;
    'strategy'?: Item114356;
}
export declare class Item114322 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114313 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114325;
    'deleted_ts'?: number;
    'deployment_zone'?: string;
    'dz_id'?: number;
    'dz_type'?: string;
    'enabled'?: boolean;
    'env'?: string;
    'id'?: number;
    'key_id'?: number;
    'key_type'?: string;
    'level'?: number;
    'middleware_data'?: Item114322;
    'path'?: string;
    'path_names'?: any[];
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
    'updated_ts'?: number;
    'version'?: number;
}
export declare class GetV1DepconfHierarchyConfigGetInfoReqDto {
    'project': string;
    'service_id': string;
    'dz_type': string;
    'level'?: string;
    'path'?: string;
}
export declare class GetV1DepconfHierarchyConfigGetInfoResDto {
    'configs'?: Item114313[];
    'success': boolean;
    'total_count'?: number;
}

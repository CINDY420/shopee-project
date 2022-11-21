import { ItemEmpty } from '.';
export declare class Item114224 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114212 {
    'max_instances'?: number;
    'selectors'?: Item114224[];
    'unique_key'?: string;
}
export declare class Item114195 {
    'name'?: string;
    'parameters'?: Item114212;
}
export declare class Item114194 {
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
export declare class Item114190 {
    'name'?: string;
    'parameters'?: Item114194;
}
export declare class Item114170 {
    'assignment_policies'?: Item114195[];
    'orchestrator'?: string;
}
export declare class Item114168 {
    'workload_type'?: string;
}
export declare class Item114164 {
    'name'?: string;
    'parameters'?: Item114194;
}
export declare class Item114163 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114162 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114168;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114190;
}
export declare class Item114153 {
    'has_next'?: boolean;
    'next_id'?: number;
}
export declare class Item114152 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114144 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114168;
    'ecp_cluster_configs'?: Item114162[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114163;
    'scheduler'?: Item114170;
    'strategy'?: Item114164;
}
export declare class Item114134 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114144;
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
    'middleware_data'?: Item114152;
    'path'?: string;
    'path_names'?: any[];
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
    'updated_ts'?: number;
    'version'?: number;
}
export declare class GetV1DepconfHierarchyConfigGetAllReqDto {
}
export declare class GetV1DepconfHierarchyConfigGetAllResDto {
    'configs'?: Item114134[];
    'meta'?: Item114153;
    'success': boolean;
    'total_count'?: number;
}

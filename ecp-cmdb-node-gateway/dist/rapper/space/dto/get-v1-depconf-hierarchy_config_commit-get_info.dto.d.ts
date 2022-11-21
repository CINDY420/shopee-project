import { ItemEmpty } from '.';
export declare class Item114655 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114644 {
    'max_instances'?: number;
    'selectors'?: Item114655[];
    'unique_key'?: string;
}
export declare class Item114626 {
    'name'?: string;
    'parameters'?: Item114644;
}
export declare class Item114619 {
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
export declare class Item114617 {
    'name'?: string;
    'parameters'?: Item114619;
}
export declare class Item114610 {
    'name'?: string;
    'parameters'?: Item114619;
}
export declare class Item114609 {
    'assignment_policies'?: Item114626[];
    'orchestrator'?: string;
}
export declare class Item114608 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114606 {
    'workload_type'?: string;
}
export declare class Item114604 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114606;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114617;
}
export declare class Item114589 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114578 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114606;
    'ecp_cluster_configs'?: Item114604[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114608;
    'scheduler'?: Item114609;
    'strategy'?: Item114610;
}
export declare class Item114574 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114578;
    'dz_type'?: string;
    'enabled'?: boolean;
    'env'?: string;
    'id'?: number;
    'key_id'?: number;
    'key_type'?: string;
    'level'?: number;
    'middleware_data'?: Item114589;
    'path'?: string;
    'project'?: string;
    'service_meta_type'?: string;
    'version'?: number;
}
export declare class GetV1DepconfHierarchyConfigCommitGetInfoReqDto {
    'project': string;
    'service_id': string;
    'dz_type': string;
    'level'?: string;
    'next_id'?: number;
    'limit'?: number;
    'get_children'?: boolean;
}
export declare class GetV1DepconfHierarchyConfigCommitGetInfoResDto {
    'commits'?: Item114574[];
    'success': boolean;
}

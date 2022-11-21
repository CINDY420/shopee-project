import { ItemEmpty } from '.';
export declare class Item114541 {
    'max_instances'?: number;
    'selectors'?: Item114458[];
    'unique_key'?: string;
}
export declare class Item114517 {
    'name'?: string;
    'parameters'?: Item114432;
}
export declare class Item114506 {
    'name'?: string;
    'parameters'?: Item114541;
}
export declare class Item114491 {
    'name'?: string;
    'parameters'?: Item114432;
}
export declare class Item114490 {
    'assignment_policies'?: Item114506[];
    'orchestrator'?: string;
}
export declare class Item114489 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114426;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114517;
}
export declare class Item114473 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114463 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114426;
    'ecp_cluster_configs'?: Item114489[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114427;
    'scheduler'?: Item114490;
    'strategy'?: Item114491;
}
export declare class Item114458 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114447 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114463;
    'dz_type'?: string;
    'enabled'?: boolean;
    'env'?: string;
    'id'?: number;
    'key_id'?: number;
    'key_type'?: string;
    'level'?: number;
    'middleware_data'?: Item114473;
    'path'?: string;
    'project'?: string;
    'service_meta_type'?: string;
    'version'?: number;
}
export declare class Item114445 {
    'max_instances'?: number;
    'selectors'?: Item114458[];
    'unique_key'?: string;
}
export declare class Item114442 {
    'name'?: string;
    'parameters'?: Item114432;
}
export declare class Item114438 {
    'name'?: string;
    'parameters'?: Item114445;
}
export declare class Item114432 {
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
export declare class Item114429 {
    'assignment_policies'?: Item114438[];
    'orchestrator'?: string;
}
export declare class Item114427 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114426 {
    'workload_type'?: string;
}
export declare class Item114423 {
    'name'?: string;
    'parameters'?: Item114432;
}
export declare class Item114420 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114426;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114442;
}
export declare class Item114412 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114426;
    'ecp_cluster_configs'?: Item114420[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114427;
    'scheduler'?: Item114429;
    'strategy'?: Item114423;
}
export declare class Item114408 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'config': Item114412;
    'deployment_zone'?: string;
    'dz_type': string;
    'env'?: string;
    'level': number;
    'version'?: number;
}
export declare class PostV1DepconfHierarchyConfigCommitCreateReqDto {
    'comment'?: string;
    'payloads'?: Item114408[];
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
}
export declare class PostV1DepconfHierarchyConfigCommitCreateResDto {
    'commits'?: Item114447[];
    'success': boolean;
}

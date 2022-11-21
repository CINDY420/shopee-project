import { ItemEmpty } from '.';
export declare class Item115118 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item115104 {
    'max_instances'?: number;
    'selectors'?: Item115118[];
    'unique_key'?: string;
}
export declare class Item115089 {
    'name'?: string;
    'parameters'?: Item115079;
}
export declare class Item115085 {
    'name'?: string;
    'parameters'?: Item115104;
}
export declare class Item115079 {
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
export declare class Item115076 {
    'name'?: string;
    'parameters'?: Item115079;
}
export declare class Item115075 {
    'assignment_policies'?: Item115085[];
    'orchestrator'?: string;
}
export declare class Item115073 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item115071 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item115068;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item115089;
}
export declare class Item115068 {
    'workload_type'?: string;
}
export declare class Item115052 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item115048 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item115068;
    'ecp_cluster_configs'?: Item115071[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item115073;
    'scheduler'?: Item115075;
    'strategy'?: Item115076;
}
export declare class Item115039 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item115048;
    'dz_type'?: string;
    'enabled'?: boolean;
    'env'?: string;
    'id'?: number;
    'key_id'?: number;
    'key_type'?: string;
    'level'?: number;
    'middleware_data'?: Item115052;
    'path'?: string;
    'project'?: string;
    'service_meta_type'?: string;
    'version'?: number;
}
export declare class GetV2AppModelHierarchyConfigCommitGetInfoReqDto {
    'project': string;
    'service_id': string;
    'service_meta_type': string;
    'dz_type': string;
    'level'?: string;
    'next_id'?: number;
    'limit'?: number;
}
export declare class GetV2AppModelHierarchyConfigCommitGetInfoResDto {
    'commits'?: Item115039[];
    'success': boolean;
}

import { ItemEmpty } from '.';
export declare class Item114858 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114845 {
    'max_instances'?: number;
    'selectors'?: Item114858[];
    'unique_key'?: string;
}
export declare class Item114828 {
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
export declare class Item114822 {
    'name'?: string;
    'parameters'?: Item114845;
}
export declare class Item114817 {
    'name'?: string;
    'parameters'?: Item114828;
}
export declare class Item114807 {
    'name'?: string;
    'parameters'?: Item114828;
}
export declare class Item114806 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114803 {
    'workload_type'?: string;
}
export declare class Item114799 {
    'assignment_policies'?: Item114822[];
    'orchestrator'?: string;
}
export declare class Item114798 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114803;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114817;
}
export declare class Item114797 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114780 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114803;
    'ecp_cluster_configs'?: Item114798[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114806;
    'scheduler'?: Item114799;
    'strategy'?: Item114807;
}
export declare class Item114771 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114780;
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
    'middleware_data'?: Item114797;
    'path'?: string;
    'path_names'?: any[];
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
    'updated_ts'?: number;
    'version'?: number;
}
export declare class GetV2AppModelHierarchyConfigGetInfoReqDto {
    'project': string;
    'service_id': string;
    'service_meta_type': string;
    'dz_type': string;
    'level'?: string;
}
export declare class GetV2AppModelHierarchyConfigGetInfoResDto {
    'configs'?: Item114771[];
    'success': boolean;
    'total_count'?: number;
}

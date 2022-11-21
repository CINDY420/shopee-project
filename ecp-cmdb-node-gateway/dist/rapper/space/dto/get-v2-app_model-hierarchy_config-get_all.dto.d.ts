import { ItemEmpty } from '.';
export declare class Item114750 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114732 {
    'max_instances'?: number;
    'selectors'?: Item114750[];
    'unique_key'?: string;
}
export declare class Item114724 {
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
export declare class Item114719 {
    'name'?: string;
    'parameters'?: Item114724;
}
export declare class Item114717 {
    'name'?: string;
    'parameters'?: Item114732;
}
export declare class Item114705 {
    'name'?: string;
    'parameters'?: Item114724;
}
export declare class Item114704 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114702 {
    'assignment_policies'?: Item114717[];
    'orchestrator'?: string;
}
export declare class Item114701 {
    'workload_type'?: string;
}
export declare class Item114698 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114701;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114719;
}
export declare class Item114693 {
    'has_next'?: boolean;
    'next_id'?: number;
}
export declare class Item114689 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114670 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114701;
    'ecp_cluster_configs'?: Item114698[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114704;
    'scheduler'?: Item114702;
    'strategy'?: Item114705;
}
export declare class Item114669 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114670;
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
    'middleware_data'?: Item114689;
    'path'?: string;
    'path_names'?: any[];
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
    'updated_ts'?: number;
    'version'?: number;
}
export declare class GetV2AppModelHierarchyConfigGetAllReqDto {
}
export declare class GetV2AppModelHierarchyConfigGetAllResDto {
    'configs'?: Item114669[];
    'meta'?: Item114693;
    'success': boolean;
    'total_count'?: number;
}

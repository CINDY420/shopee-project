import { ItemEmpty } from '.';
export declare class Item115009 {
    'max_instances'?: number;
    'selectors'?: Item114914[];
    'unique_key'?: string;
}
export declare class Item114997 {
    'name'?: string;
    'parameters'?: Item114894;
}
export declare class Item114990 {
    'name'?: string;
    'parameters'?: Item115009;
}
export declare class Item114975 {
    'assignment_policies'?: Item114990[];
    'orchestrator'?: string;
}
export declare class Item114973 {
    'name'?: string;
    'parameters'?: Item114894;
}
export declare class Item114971 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114871;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114997;
}
export declare class Item114949 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114871;
    'ecp_cluster_configs'?: Item114971[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114877;
    'scheduler'?: Item114975;
    'strategy'?: Item114973;
}
export declare class Item114945 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: Item114949;
    'dz_type'?: string;
    'enabled'?: boolean;
    'env'?: string;
    'id'?: number;
    'key_id'?: number;
    'key_type'?: string;
    'level'?: number;
    'middleware_data'?: Item114933;
    'path'?: string;
    'project'?: string;
    'service_meta_type'?: string;
    'version'?: number;
}
export declare class Item114933 {
    'acl'?: string;
    'alias'?: string;
    'dr_cluster'?: string;
    'dr_data_sync_method'?: string;
    'dr_enable'?: boolean;
    'password'?: string;
    'users'?: string;
}
export declare class Item114914 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114898 {
    'max_instances'?: number;
    'selectors'?: Item114914[];
    'unique_key'?: string;
}
export declare class Item114894 {
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
export declare class Item114887 {
    'name'?: string;
    'parameters'?: Item114898;
}
export declare class Item114881 {
    'name'?: string;
    'parameters'?: Item114894;
}
export declare class Item114879 {
    'name'?: string;
    'parameters'?: Item114894;
}
export declare class Item114878 {
    'assignment_policies'?: Item114887[];
    'orchestrator'?: string;
}
export declare class Item114877 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114874 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114871;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114881;
}
export declare class Item114871 {
    'workload_type'?: string;
}
export declare class Item114869 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114871;
    'ecp_cluster_configs'?: Item114874[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114877;
    'scheduler'?: Item114878;
    'strategy'?: Item114879;
}
export declare class PostV2AppModelHierarchyConfigCommitCreateReqDto {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'comment'?: string;
    'config'?: Item114869;
    'deployment_zone'?: string;
    'dz_type': string;
    'env'?: string;
    'level'?: number;
    'middleware_config'?: Item114933;
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
    'version'?: number;
}
export declare class PostV2AppModelHierarchyConfigCommitCreateResDto {
    'commits'?: Item114945[];
    'success': boolean;
}

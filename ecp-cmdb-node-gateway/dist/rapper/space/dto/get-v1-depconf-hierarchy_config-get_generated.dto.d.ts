import { ItemEmpty } from '.';
export declare class Item114289 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item114275 {
    'max_instances'?: number;
    'selectors'?: Item114289[];
    'unique_key'?: string;
}
export declare class Item114268 {
    'name'?: string;
    'parameters'?: Item114262;
}
export declare class Item114262 {
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
export declare class Item114259 {
    'name'?: string;
    'parameters'?: Item114275;
}
export declare class Item114257 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item114256 {
    'canary_init_count'?: number;
    'cluster'?: string;
    'component_detail'?: Item114255;
    'enable_canary'?: boolean;
    'replicas'?: number;
    'strategy_definition'?: Item114268;
}
export declare class Item114255 {
    'workload_type'?: string;
}
export declare class Item114249 {
    'name'?: string;
    'parameters'?: Item114262;
}
export declare class Item114248 {
    'assignment_policies'?: Item114259[];
    'orchestrator'?: string;
}
export declare class Item114242 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'component_detail'?: Item114255;
    'ecp_cluster_configs'?: Item114256[];
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item114257;
    'scheduler'?: Item114248;
    'strategy'?: Item114249;
}
export declare class Item114237 {
    'az'?: string;
    'az_v2'?: string;
    'cid'?: string;
    'data'?: Item114242;
    'deployment_zone_enum'?: number;
    'deployment_zone_name'?: string;
    'deployment_zone_type'?: string;
    'env'?: string;
}
export declare class GetV1DepconfHierarchyConfigGetGeneratedReqDto {
    'project': string;
    'service_id': string;
    'dz_type': string;
    'env': string;
    'cid': string;
    'cid_group': string;
}
export declare class GetV1DepconfHierarchyConfigGetGeneratedResDto {
    'configs'?: Item114237[];
    'project'?: string;
    'service_id'?: number;
    'success': boolean;
}

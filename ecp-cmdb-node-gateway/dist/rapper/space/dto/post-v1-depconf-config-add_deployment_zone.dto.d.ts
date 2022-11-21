export declare class Item113923 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item113920 {
    'max_instances'?: number;
    'selectors'?: Item113923[];
    'unique_key'?: string;
}
export declare class Item113906 {
    'name'?: string;
    'parameters'?: Item113920;
}
export declare class Item113900 {
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
export declare class Item113896 {
    'final'?: string;
    'stages'?: any[];
}
export declare class Item113894 {
    'name'?: string;
    'parameters'?: Item113900;
}
export declare class Item113890 {
    'instances'?: string;
    'mode'?: string;
    'multi_stage'?: Item113896;
}
export declare class Item113889 {
    'assignment_policies'?: Item113906[];
}
export declare class Item113888 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
    'skip_mem_limit_check'?: boolean;
}
export declare class Item113887 {
    'enabled'?: boolean;
}
export declare class Item113885 {
    'canary'?: Item113890;
    'enabled'?: boolean;
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item113888;
    'scheduler'?: Item113889;
    'strategy'?: Item113894;
}
export declare class Item113876 {
    'container'?: Item113885;
    'env'?: string;
    'static_files'?: Item113887;
}
export declare class Item113875 {
    'envs'?: any[];
    'full_name'?: string;
    'id'?: number;
    'name'?: string;
    'namespace'?: string;
    'zone_type'?: string;
    'zone_val'?: number;
}
export declare class Item113872 {
    'envs'?: Item113876[];
}
export declare class Item113871 {
    'definition'?: Item113872;
    'dz_type'?: string;
    'zone_id'?: number;
}
export declare class PostV1DepconfConfigAddDeploymentZoneReqDto {
    'project'?: string;
    'service_id'?: number;
    'zones'?: Item113871[];
}
export declare class PostV1DepconfConfigAddDeploymentZoneResDto {
    'bound_zones'?: Item113875[];
    'success': boolean;
}

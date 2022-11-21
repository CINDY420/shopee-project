import { ItemEmpty } from '.';
export declare class Item113974 {
    'key'?: string;
    'operator'?: string;
    'value'?: string;
    'values'?: any[];
}
export declare class Item113968 {
    'max_instances'?: number;
    'selectors'?: Item113974[];
    'unique_key'?: string;
}
export declare class Item113953 {
    'name'?: string;
    'parameters'?: Item113968;
}
export declare class Item113951 {
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
export declare class Item113950 {
    'cpu'?: number;
    'disk'?: number;
    'gpu'?: number;
    'mem'?: number;
}
export declare class Item113949 {
    'assignment_policies'?: Item113953[];
    'orchestrator'?: string;
}
export declare class Item113944 {
    'name'?: string;
    'parameters'?: Item113951;
}
export declare class Item113937 {
    'annotations'?: ItemEmpty;
    'canary_instances'?: number;
    'canary_percent'?: number;
    'instances'?: number;
    'minimum_instances'?: number;
    'resources'?: Item113950;
    'scheduler'?: Item113949;
    'strategy'?: Item113944;
}
export declare class Item113936 {
    'az'?: string;
    'cid'?: string;
    'data'?: Item113937;
    'env'?: string;
    'project_module'?: string;
    'service_id'?: number;
}
export declare class PostV1DepconfConfigBulkGetFieldReqDto {
    'env'?: string;
    'fields'?: any[];
    'limit'?: number;
    'next_id'?: number;
    'project_modules'?: any[];
    'service_ids'?: any[];
    'service_meta_type'?: string;
}
export declare class PostV1DepconfConfigBulkGetFieldResDto {
    'configs'?: Item113936[];
}

export declare class Item115134 {
    'category': string;
    'name': string;
    'nameDisplay': string;
    'type': string;
}
export declare class Item115131 {
    'az': string;
    'env': string;
    'workloads': Item115134[];
}
export declare class GetEcpapiV2WorkloadsReqDto {
    'version'?: string;
    'env'?: string;
}
export declare class GetEcpapiV2WorkloadsResDto {
    'items': Item115131[];
}

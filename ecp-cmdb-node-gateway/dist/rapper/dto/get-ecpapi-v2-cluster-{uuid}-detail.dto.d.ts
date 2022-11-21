export declare class Item99385 {
    'azV1'?: string;
    'azV2'?: string;
    'clusterKey'?: string;
    'displayName'?: string;
    'ecpVersion'?: string;
    'handleByGalio'?: boolean;
    'kubeApiserverType'?: string;
    'kubeConfig'?: string;
    'monitoringUrl'?: string;
    'region'?: string;
    'segment'?: string;
    'uuid'?: string;
}
export declare class Item99384 {
    'meta'?: Item99385;
}
export declare class GetEcpapiV2Cluster1UuidDetailReqDto {
    'uuid': string;
}
export declare class GetEcpapiV2Cluster1UuidDetailResDto {
    'detail'?: Item99384;
}

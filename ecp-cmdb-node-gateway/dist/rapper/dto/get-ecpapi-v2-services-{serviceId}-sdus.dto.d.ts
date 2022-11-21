export declare class Item99594 {
    'module': string;
    'project': string;
}
export declare class Item99587 {
    'cid': string;
    'deploymentLink': string;
    'env': string;
    'idcs': any[];
    'identifier': Item99594;
    'resourceType': string;
    'sdu': string;
    'sduId': number;
    'serviceId': number;
    'serviceName': string;
    'version': string;
}
export declare class GetEcpapiV2Services1ServiceIdSdusReqDto {
    'serviceId': string;
    'filterBy'?: string;
    'keyword'?: string;
}
export declare class GetEcpapiV2Services1ServiceIdSdusResDto {
    'items': Item99587[];
    'totalSize': number;
}

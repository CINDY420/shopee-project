import { ItemEmpty } from '.';
export declare class Item141454 {
    'cid': string;
    'created_at': number;
    'deployment_link': string;
    'env': string;
    'idcs': any[];
    'label': ItemEmpty;
    'resource_type': string;
    'sdu': string;
    'updated_at': number;
    'version': string;
}
export declare class GetApisCmdbV2ServiceGetUnboundedSdusReqDto {
    'resource_type'?: string;
}
export declare class GetApisCmdbV2ServiceGetUnboundedSdusResDto {
    'sdu': Item141454[];
    'total_size': number;
}

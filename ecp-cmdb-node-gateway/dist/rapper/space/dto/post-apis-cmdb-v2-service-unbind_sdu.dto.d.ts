import { ItemEmpty } from '.';
export declare class Item141525 {
    'created_at': number;
    'enabled': boolean;
    'sdu_id': number;
    'service_id': number;
    'service_sdu_relation_id': number;
    'updated_at': number;
}
export declare class Item141514 {
    'cid': string;
    'created_at': number;
    'deployment_link': string;
    'env': string;
    'idcs': string[];
    'label': ItemEmpty;
    'resource_type': string;
    'sdu': string;
    'updated_at': number;
    'version': string;
}
export declare class Item141507 {
    'spexible': string;
}
export declare class Item141504 {
    'created_at': number;
    'data': Item141507;
    'enabled': boolean;
    'service_id': number;
    'service_name': string;
    'service_owners': any[];
    'updated_at': number;
    'updated_by': string;
}
export declare class Item141503 {
    'sdu': Item141514;
    'service': Item141504;
    'unbind': Item141525;
}
export declare class PostApisCmdbV2ServiceUnbindSduReqDto {
    'service_name': string;
    'resource_type': string;
    'sdu': string;
    'force'?: boolean;
}
export declare class PostApisCmdbV2ServiceUnbindSduResDto {
    'unbounded': Item141503[];
}

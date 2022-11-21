import { ItemEmpty } from '.';
export declare class Item141488 {
    'created_at': number;
    'enabled': boolean;
    'sdu_id': number;
    'service_id': number;
    'service_sdu_relation_id': number;
    'updated_at': number;
}
export declare class Item141477 {
    'cid': string;
    'created_at': number;
    'deployment_link': string;
    'env': string;
    'idcs': string[];
    'label': ItemEmpty;
    'sdu': string;
    'sdu_type': string;
    'updated_at': number;
    'version': string;
}
export declare class Item141470 {
    'spexible': string;
}
export declare class Item141467 {
    'created_at': number;
    'data': Item141470;
    'enabled': boolean;
    'service_id': number;
    'service_name': string;
    'service_owners': any[];
    'updated_at': number;
    'updated_by': string;
}
export declare class Item141466 {
    'bind': Item141488;
    'sdu': Item141477;
    'service': Item141467;
}
export declare class PostApisCmdbV2ServiceBindSduReqDto {
    'service_name': string;
    'resource_type': string;
    'sdu': string;
    'force'?: boolean;
}
export declare class PostApisCmdbV2ServiceBindSduResDto {
    'bounded': Item141466[];
}

import { ItemEmpty } from '.';
export declare class Item114040 {
    'comment'?: string;
    'commit_id'?: number;
    'created_by'?: string;
    'created_ts'?: number;
    'data'?: string;
    'deleted_at'?: number;
    'env'?: string;
    'extra_data'?: ItemEmpty;
    'id'?: number;
    'modified_by'?: string;
    'modified_ts'?: number;
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
}
export declare class GetV1DepconfConfigGetInfoReqDto {
    'project'?: string;
    'service_id'?: string;
    'env': string;
}
export declare class GetV1DepconfConfigGetInfoResDto {
    'configurations'?: Item114040[];
    'success': boolean;
    'total_count'?: number;
}

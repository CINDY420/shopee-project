import { ItemEmpty } from '.';
export declare class Item114006 {
    'has_next'?: boolean;
    'next_id'?: number;
}
export declare class Item113992 {
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
export declare class GetV1DepconfConfigGetAllReqDto {
    'env'?: string;
    'next_id'?: number;
    'limit'?: number;
}
export declare class GetV1DepconfConfigGetAllResDto {
    'configurations'?: Item113992[];
    'meta'?: Item114006;
    'success': boolean;
    'total_count'?: number;
}

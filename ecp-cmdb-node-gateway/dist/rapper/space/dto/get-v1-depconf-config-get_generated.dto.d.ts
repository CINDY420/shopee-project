import { ItemEmpty } from '.';
export declare class Item114020 {
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
export declare class GetV1DepconfConfigGetGeneratedReqDto {
    'project'?: string;
    'service_id'?: string;
    'env': string;
}
export declare class GetV1DepconfConfigGetGeneratedResDto {
    'configurations'?: Item114020[];
    'success': boolean;
    'total_count'?: number;
}

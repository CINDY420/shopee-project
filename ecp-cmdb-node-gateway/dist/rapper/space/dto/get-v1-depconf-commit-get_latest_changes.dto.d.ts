import { ItemEmpty } from '.';
export declare class Item113856 {
    'comment'?: string;
    'created_by'?: string;
    'created_time'?: number;
    'data'?: string;
    'env'?: string;
    'extra_data'?: ItemEmpty;
    'id'?: number;
    'project'?: string;
    'service_id'?: number;
    'service_meta_type'?: string;
}
export declare class GetV1DepconfCommitGetLatestChangesReqDto {
    'project'?: string;
    'service_id'?: string;
    'env'?: string;
    'last_n'?: number;
}
export declare class GetV1DepconfCommitGetLatestChangesResDto {
    'commits'?: Item113856[];
    'success': boolean;
    'total_count'?: number;
}

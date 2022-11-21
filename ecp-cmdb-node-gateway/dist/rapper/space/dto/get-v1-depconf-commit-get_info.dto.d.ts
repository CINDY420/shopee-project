import { ItemEmpty } from '.';
export declare class Item113839 {
    'comment': string;
    'created_by': string;
    'created_time': number;
    'data': string;
    'env': string;
    'extra_data': ItemEmpty;
    'id': number;
    'project': string;
    'service_id': number;
    'service_meta_type': string;
}
export declare class GetV1DepconfCommitGetInfoReqDto {
    'project'?: string;
    'service_id'?: string;
    'env': string;
    'commit_id'?: string;
    'page'?: number;
    'limit'?: number;
}
export declare class GetV1DepconfCommitGetInfoResDto {
    'commits': Item113839[];
    'success': boolean;
    'total_count': number;
}

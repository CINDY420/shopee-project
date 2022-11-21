export declare class Item113810 {
    'created_at'?: number;
    'deleted_at'?: number;
    'project'?: string;
    'service_id'?: number;
    'service_name'?: string;
}
export declare class GetV1DepconfBindingListReqDto {
    'project'?: string;
    'service_id'?: number;
    'disabled'?: string;
}
export declare class GetV1DepconfBindingListResDto {
    'projects'?: Item113810[];
    'success': boolean;
}

import { ItemEmpty } from '.';
export declare class Item99420 {
    'applied'?: number;
    'used'?: number;
}
export declare class Item99414 {
    'effect'?: string;
    'key'?: string;
    'val'?: string;
}
export declare class Item99411 {
    'cpu'?: Item99420;
    'mem'?: Item99420;
    'pods'?: Item99420;
}
export declare class Item99409 {
    'cluster'?: string;
    'extraStatus'?: any[];
    'ip'?: string;
    'labels'?: ItemEmpty;
    'metrics'?: Item99411;
    'nodeName'?: string;
    'roles'?: any[];
    'status'?: string;
    'taints'?: Item99414[];
}
export declare class GetEcpapiV2Clusters1ClusterNameNodesReqDto {
    'clusterName': string;
}
export declare class GetEcpapiV2Clusters1ClusterNameNodesResDto {
    'items'?: Item99409[];
    'total'?: number;
}

export declare class Item107360 {
    'namespace': string;
    'podName': string;
}
export declare class Item99624 {
    'applied': number;
    'used': number;
}
export declare class Item99622 {
    'cpu': Item99624;
    'memory': Item99624;
    'namespace': string;
    'podName': string;
}
export declare class PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto {
    'deployId': string;
    'metrics': string;
    'deployId': string;
    'pods': Item107360[];
}
export declare class PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto {
    'items': Item99622[];
}

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
export declare class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsMetricsReqDto {
    'metrics': string;
    'deployId': string;
    'pods': Item107360[];
    'sduName': string;
}
export declare class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsMetricsResDto {
    'items': Item99622[];
}

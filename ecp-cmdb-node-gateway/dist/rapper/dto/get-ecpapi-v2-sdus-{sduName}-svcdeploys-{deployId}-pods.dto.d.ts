export declare class Item99605 {
    'cid': string;
    'clusterName': string;
    'createdTime': number;
    'env': string;
    'lastRestartTime': number;
    'namespace': string;
    'nodeIp': string;
    'nodeName': string;
    'phase': string;
    'podIp': string;
    'podName': string;
    'restartCount': number;
    'sdu': string;
    'status': string;
    'tag': string;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsReqDto {
    'sduName': string;
    'deployId': string;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdPodsResDto {
    'items': Item99605[];
    'total': number;
}

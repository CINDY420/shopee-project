export declare class Item99455 {
    'image': string;
    'name': string;
    'phase': string;
    'tag': string;
}
export declare class Item99451 {
    'containers': Item99455[];
    'orchestrator': string;
    'reason': string;
}
export declare class Item99448 {
    'canaryInstances': number;
    'cpu': number;
    'disk': number;
    'healthyInstances': number;
    'killingInstances': number;
    'lastDeployed': number;
    'mem': number;
    'releaseInstances': number;
    'runningInstances': number;
    'stagingInstances': number;
    'startingInstances': number;
    'state': string;
    'targetInstances': number;
    'unhealthyInstances': number;
    'unknownInstances': number;
}
export declare class Item99435 {
    'azV1': string;
    'azV2': string;
    'bundle': string;
    'cid': string;
    'cluster': string;
    'clusterType': string;
    'componentType': string;
    'deployEngine': string;
    'deployId': string;
    'env': string;
    'feature': string;
    'module': string;
    'project': string;
    'sduName': string;
    'status': Item99451;
    'summary': Item99448;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploysReqDto {
    'sduName': string;
    'withdetail'?: boolean;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploysResDto {
    'items': Item99435[];
    'total': number;
}

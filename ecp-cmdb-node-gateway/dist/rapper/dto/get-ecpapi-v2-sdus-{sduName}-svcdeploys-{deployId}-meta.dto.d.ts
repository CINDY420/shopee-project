export declare class Item99508 {
    'image': string;
    'name': string;
    'phase': string;
    'tag': string;
}
export declare class Item99485 {
    'containers': Item99508[];
    'orchestrator': string;
    'reason': string;
}
export declare class Item99484 {
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
export declare class Item99477 {
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
    'status': Item99485;
    'summary': Item99484;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto {
    'sduName': string;
    'deployId': string;
}
export declare class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto {
    'deployment': Item99477;
}

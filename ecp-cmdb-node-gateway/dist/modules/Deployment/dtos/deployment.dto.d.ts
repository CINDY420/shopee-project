export declare class GetDeploymentMetaParam {
    sduName: string;
    deployId: string;
}
declare class Container {
    phase: string;
    name: string;
    image: string;
    tag: string;
}
export declare class GetDeploymentMetaResponse {
    project: string;
    module: string;
    env: string;
    cid: string;
    azV1: string;
    azV2: string;
    deployEngine: string;
    cluster: string;
    clusterType: string;
    componentType: string;
    releaseInstances: number;
    canaryInstances: number;
    containers: Container[];
}
export {};

export declare class ListSduParam {
    serviceId: string;
}
export declare class ListSduQuery {
    searchBy?: string;
    filterBy?: string;
    sduFilterBy?: string;
    orderBy?: string;
    offset?: number;
    limit?: number;
}
export declare class ListSduResponse {
    items: SduList[];
    total: number;
    totalOfInstances: number;
}
export declare class SduList {
    sduId: number;
    serviceId: number;
    sdu: string;
    resourceType: string;
    env: string;
    cid: string;
    idcs: unknown[];
    version: string;
    deploymentLink: string;
    serviceName: string;
    identifier: Identifier;
    summary: Summary;
    deployments: Deployment[];
}
export declare class Deployment {
    deployId: string;
    sduName: string;
    azV1: string;
    deployEngine: string;
    cluster: string;
    componentType: string;
    status: DeploymentStatus;
    summary: DeploymentSummary;
}
declare class DeploymentStatus {
    containers: Container[];
    orchestrator: string;
    reason: string;
}
declare class DeploymentSummary {
    targetInstances: number;
    unhealthyInstances: number;
    state: string;
    disk: number;
    cpu: number;
    mem: number;
    lastDeployed: number;
}
declare class Container {
    phase: string;
    name: string;
    image: string;
    tag: string;
}
export declare class Identifier {
    module: string;
    project: string;
}
export declare class Summary {
    cpu: number;
    mem: number;
    disk: number;
    lastDeployed: number;
    state: string;
    targetInstances: number;
    unhealthyInstances: number;
}
export {};

export declare class ScaleSDUParam {
    sduName: string;
}
export declare class DeployInstances {
    releaseReplicas: number;
    canaryReplicas?: number;
    canaryValid?: boolean;
}
export declare class DeployMeta {
    az: string;
    componentType: string;
}
export declare class DeploymentInstances {
    instances: DeployInstances;
    meta: DeployMeta;
}
export declare class ScaleSDUBody {
    deployments: {
        [key: string]: DeploymentInstances;
    };
}

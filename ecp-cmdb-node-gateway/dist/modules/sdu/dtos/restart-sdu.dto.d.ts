export declare class RestartSDUParam {
    sduName: string;
}
declare class DeployRestart {
    deployId: string;
    phases: string[];
}
export declare class RestartSDUBody {
    deployRestarts: DeployRestart[];
}
export {};

import { GetDeploymentMetaParam } from '@/modules/deployment/dtos/deployment.dto';
import { ListDeploymentsParam, ListDeploymentsQuery } from '@/modules/deployment/dtos/list-deployments.dto';
import { ScaleDeploymentBody, ScaleDeploymentParam } from '@/modules/deployment/dtos/scale-deployment.dto';
import { FetchService } from '@/modules/fetch/fetch.service';
export declare class DeploymentService {
    private readonly fetchService;
    constructor(fetchService: FetchService);
    getDeploymentMeta(param: GetDeploymentMetaParam): Promise<{
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
        containers: {
            name: string;
            phase: string;
            image: string;
            tag: string;
        }[];
    }>;
    listDeployments(param: ListDeploymentsParam, query: ListDeploymentsQuery): Promise<{
        items: {
            deployId: string;
            env: string;
            bundle: string;
            sduName: string;
            project: string;
            componentType: string;
            module: string;
            feature: string;
            cid: string;
            azV1: string;
            azV2: string;
            cluster: string;
            summary: {
                cpu: number;
                healthyInstances: number;
                mem: number;
                disk: number;
                stagingInstances: number;
                unhealthyInstances: number;
                killingInstances: number;
                runningInstances: number;
                startingInstances: number;
                targetInstances: number;
                unknownInstances: number;
                canaryInstances: number;
                releaseInstances: number;
                state: string;
                lastDeployed: number;
            };
            clusterType: string;
            deployEngine: string;
            status: {
                orchestrator: string;
                reason: string;
                containers: {
                    phase: string;
                    tag: string;
                    image: string;
                    name: string;
                }[];
            };
        }[];
        total: number;
    }>;
    scaleDeployment(param: ScaleDeploymentParam, body: ScaleDeploymentBody): Promise<void>;
}

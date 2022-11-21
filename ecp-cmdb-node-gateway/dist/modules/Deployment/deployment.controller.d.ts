import { DeploymentService } from '@/modules/deployment/deployment.service';
import { GetDeploymentMetaParam, GetDeploymentMetaResponse } from '@/modules/deployment/dtos/deployment.dto';
import { ListDeploymentsParam, ListDeploymentsQuery, ListDeploymentsResponse } from '@/modules/deployment/dtos/list-deployments.dto';
import { ScaleDeploymentBody, ScaleDeploymentParam } from '@/modules/deployment/dtos/scale-deployment.dto';
export declare class DeploymentController {
    private deploymentService;
    constructor(deploymentService: DeploymentService);
    getDeploymentMeta(param: GetDeploymentMetaParam): Promise<GetDeploymentMetaResponse>;
    listDeployments(param: ListDeploymentsParam, query: ListDeploymentsQuery): Promise<ListDeploymentsResponse>;
    scaleDeployment(param: ScaleDeploymentParam, body: ScaleDeploymentBody): Promise<void>;
}

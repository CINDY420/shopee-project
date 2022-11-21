import { PodService } from '@/modules/pod/pod.service';
import { ListDeploymentPodParam, ListDeploymentPodQuery, ListDeploymentPodResponse, KillPodParam, KillPodBody } from '@/modules/pod/dto/pod.dto';
export declare class PodController {
    private podService;
    constructor(podService: PodService);
    listDeploymentPods(param: ListDeploymentPodParam, query: ListDeploymentPodQuery): Promise<ListDeploymentPodResponse>;
    killPod(param: KillPodParam, body: KillPodBody): Promise<unknown>;
}

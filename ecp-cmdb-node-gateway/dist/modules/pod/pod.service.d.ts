import { ListDeploymentPodParam, ListDeploymentPodQuery, KillPodParam, KillPodBody } from '@/modules/pod/dto/pod.dto';
import { FetchService } from '@/modules/fetch/fetch.service';
export declare class PodService {
    private readonly fetchService;
    constructor(fetchService: FetchService);
    private formatPodMetricFn;
    listDeploymentPods(param: ListDeploymentPodParam, query: ListDeploymentPodQuery): Promise<{
        items: {
            cpu: {
                applied: number;
                used: number;
            };
            memory: {
                applied: number;
                used: number;
            };
            nodeName: string;
            clusterName: string;
            podName: string;
            podIp: string;
            namespace: string;
            createdTime: number;
            cid: string;
            sdu: string;
            env: string;
            lastRestartTime: number;
            status: string;
            phase: string;
            restartCount: number;
            tag: string;
            nodeIp: string;
        }[];
        statusList: string[];
        total: number;
    }>;
    killPod(param: KillPodParam, body: KillPodBody): Promise<void>;
}

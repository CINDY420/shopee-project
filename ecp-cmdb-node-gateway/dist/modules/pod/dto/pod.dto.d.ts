import { IModels } from '@/rapper/cmdb/request';
import { ListQuery } from '@/helpers/models/list-query.dto';
export declare class ListDeploymentPodParam {
    sduName: string;
    deployId: string;
}
export declare class ListDeploymentPodQuery extends ListQuery {
}
export declare class PodList {
    podName: string;
    nodeName: string;
    clusterName: string;
    namespace: string;
    sdu: string;
    cid: string;
    env: string;
    nodeIp: string;
    podIp: string;
    status: string;
    createdTime: number;
    phase: string;
    tag: string;
    restartCount: number;
    lastRestartTime: number;
    cpu: {
        applied: number;
        used: number;
    };
    memory: {
        applied: number;
        used: number;
    };
}
export declare class ListDeploymentPodResponse {
    items: PodList[];
    statusList: string[];
    total: number;
}
export declare class KillPodParam {
    sduName: string;
    deployId: string;
    podName: string;
}
export declare class KillPodBody {
    clusterName: string;
    namespace: string;
}
export declare type PodMetric = IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics']['Res']['items'][0];

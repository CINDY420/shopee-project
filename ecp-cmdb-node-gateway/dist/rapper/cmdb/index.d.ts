import { createFetch, IModels } from './request';
import * as commonLib from '@infra/rapper/runtime/commonLib';
declare const defaultFetch: ({ url, method, params, extra, fetchOption, }: commonLib.IDefaultFetchParams) => Promise<any>;
declare let fetch: {
    'GET/api/v1/ping': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        string?: string | undefined;
        number?: number | undefined;
        boolean?: boolean | undefined;
        regexp?: string | undefined;
        function?: string | undefined;
        array?: {
            foo?: number | undefined;
            bar?: string | undefined;
        }[] | undefined;
        items?: unknown[] | undefined;
        object?: {
            foo?: number | undefined;
            bar?: string | undefined;
        } | undefined;
        placeholder?: string | undefined;
    }>;
    'GET/ecpapi/v2/az/{azKey}/mapping': (req?: {
        azKey: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        version?: string | undefined;
        items?: {
            version?: string | undefined;
            azKey?: string | undefined;
        }[] | undefined;
    }>;
    'GET/ecpapi/v2/azs': (req?: {
        version?: string | undefined;
        env?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
            name: string;
            type: string;
            env: string;
            clusters: string[];
        }[];
    }>;
    'GET/ecpapi/v2/check': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        app?: string | undefined;
        message?: string | undefined;
    }>;
    'GET/ecpapi/v2/cluster/{uuid}/detail': (req?: {
        uuid: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        detail?: {
            meta?: {
                uuid?: string | undefined;
                clusterKey?: string | undefined;
                kubeConfig?: string | undefined;
                azV1?: string | undefined;
                azV2?: string | undefined;
                displayName?: string | undefined;
                region?: string | undefined;
                segment?: string | undefined;
                monitoringUrl?: string | undefined;
                kubeApiserverType?: string | undefined;
                ecpVersion?: string | undefined;
                handleByGalio?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>;
    'POST/ecpapi/v2/clustermeta': (req?: {
        uuid?: string | undefined;
        clusterKey?: string | undefined;
        displayName?: string | undefined;
        kubeConfig?: string | undefined;
        azV1?: string | undefined;
        azV2?: string | undefined;
        monitoringUrl?: string | undefined;
        kubeApiserverType?: string | undefined;
        ecpVersion?: string | undefined;
        handleByGalio?: boolean | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'GET/ecpapi/v2/clusters/{clusterName}/nodes': (req?: {
        clusterName: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items?: {
            cluster?: string | undefined;
            metrics?: {
                pods?: {
                    applied?: number | undefined;
                    used?: number | undefined;
                } | undefined;
                cpu?: {
                    applied?: number | undefined;
                    used?: number | undefined;
                } | undefined;
                mem?: {
                    applied?: number | undefined;
                    used?: number | undefined;
                } | undefined;
            } | undefined;
            extraStatus?: unknown[] | undefined;
            labels?: {} | undefined;
            taints?: {
                key?: string | undefined;
                val?: string | undefined;
                effect?: string | undefined;
            }[] | undefined;
            nodeName?: string | undefined;
            ip?: string | undefined;
            status?: string | undefined;
            roles?: unknown[] | undefined;
        }[] | undefined;
        total?: number | undefined;
    }>;
    'POST/ecpapi/v2/sdus/{sduName}/deployments': (req?: {
        __scene?: string | undefined;
        sduName?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        deployId?: string | undefined;
    }>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys': (req?: {
        sduName: string;
        withdetail?: boolean | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
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
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        deployment: {
            cluster: string;
            clusterType: string;
            azV1: string;
            azV2: string;
            deployEngine: string;
            componentType: string;
            summary: {
                stagingInstances: number;
                cpu: number;
                unhealthyInstances: number;
                releaseInstances: number;
                healthyInstances: number;
                killingInstances: number;
                mem: number;
                runningInstances: number;
                state: string;
                disk: number;
                lastDeployed: number;
                startingInstances: number;
                targetInstances: number;
                unknownInstances: number;
                canaryInstances: number;
            };
            status: {
                containers: {
                    name: string;
                    phase: string;
                    image: string;
                    tag: string;
                }[];
                reason: string;
                orchestrator: string;
            };
            bundle: string;
            feature: string;
            module: string;
            deployId: string;
            cid: string;
            sduName: string;
            env: string;
            project: string;
        };
    }>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        status?: {} | undefined;
        reason?: string | undefined;
    }>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart': (req?: {
        sduName: string;
        deployId: string;
        phases: string[];
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback': (req?: {
        __scene?: string | undefined;
        sduName?: string | undefined;
        deployId?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale': (req?: {
        releaseReplicas?: number | undefined;
        canaryReplicas?: number | undefined;
        canaryValid?: boolean | undefined;
        __scene?: string | undefined;
        sduName?: string | undefined;
        deployId?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'GET/ecpapi/v2/workloads': (req?: {
        version?: string | undefined;
        env?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
            env: string;
            az: string;
            workloads: {
                name: string;
                nameDisplay: string;
                type: string;
                category: string;
            }[];
        }[];
    }>;
    'GET/ecpapi/v2/sdus/{sduName}/hpas': (req?: {
        sduName: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
            id: number;
            meta: {
                sdu: string;
                az: string;
            };
            spec: {
                autoscalingLogic: string;
                behavior: {
                    scaleUp: {
                        stabilizationWindowSeconds: number;
                        notifyFailed: boolean;
                        selected: boolean;
                    };
                    scaleDown: {
                        notifyFailed: boolean;
                        selected: boolean;
                        stabilizationWindowSeconds: number;
                    };
                };
                notifyChannel: string;
                triggerRules: {
                    cronRule: {
                        repeatType: {};
                        endWeekday: {};
                        startTime: string;
                        startWeekday: {};
                        endTime: string;
                        targetCount: number;
                    };
                    type: string;
                    autoscalingRule: {
                        metrics: string;
                        threshold: number;
                    };
                }[];
                minReplicaCount: number;
                maxReplicaCount: number;
                updatedTime: string;
                status: number;
                updator: string;
            };
        }[];
        total: number;
    }>;
    'GET/ecpapi/v2/sdus/{sduName}/summary': (req?: {
        sduName: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        summary: {
            cpu: number;
            mem: number;
            healthyInstances: number;
            startingInstances: number;
            targetInstances: number;
            disk: number;
            state: string;
            killingInstances: number;
            lastDeployed: number;
            runningInstances: number;
            stagingInstances: number;
            unhealthyInstances: number;
            releaseInstances: number;
            canaryInstances: number;
            unknownInstances: number;
        };
    }>;
    'GET/ecpapi/v2/services/{serviceId}/sdus': (req?: {
        serviceId: string;
        filterBy?: string | undefined;
        keyword?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
            env: string;
            cid: string;
            sduId: number;
            deploymentLink: string;
            serviceName: string;
            identifier: {
                project: string;
                module: string;
            };
            sdu: string;
            serviceId: number;
            resourceType: string;
            idcs: unknown[];
            version: string;
        }[];
        totalSize: number;
    }>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods': (req?: {
        sduName: string;
        deployId: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
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
        total: number;
    }>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': (req?: {
        sduName: string;
        deployId: string;
        podName: string;
        clusterName: string;
        namespace: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics': (req?: {
        deployId: string;
        pods: {
            podName: string;
            namespace: string;
        }[];
        sduName: string;
        __scene?: string | undefined;
        metrics?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        items: {
            podName: string;
            cpu: {
                applied: number;
                used: number;
            };
            namespace: string;
            memory: {
                used: number;
                applied: number;
            };
        }[];
    }>;
};
export declare const overrideFetch: (fetchConfig: commonLib.RequesterOption) => void;
export { fetch, createFetch, defaultFetch };
export declare type Models = IModels;

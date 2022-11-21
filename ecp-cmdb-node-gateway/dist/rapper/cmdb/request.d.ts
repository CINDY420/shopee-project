import * as commonLib from '@infra/rapper/runtime/commonLib';
export interface IModels {
    'GET/api/v1/ping': {
        Req: {
            __scene?: string;
        };
        Res: {
            string?: string;
            number?: number;
            boolean?: boolean;
            regexp?: string;
            function?: string;
            array?: {
                foo?: number;
                bar?: string;
            }[];
            items?: unknown[];
            object?: {
                foo?: number;
                bar?: string;
            };
            placeholder?: string;
        };
    };
    'GET/ecpapi/v2/az/{azKey}/mapping': {
        Req: {
            azKey: string;
            __scene?: string;
        };
        Res: {
            version?: string;
            items?: {
                version?: string;
                azKey?: string;
            }[];
        };
    };
    'GET/ecpapi/v2/azs': {
        Req: {
            version?: string;
            env?: string;
            __scene?: string;
        };
        Res: {
            items: {
                name: string;
                type: string;
                env: string;
                clusters: string[];
            }[];
        };
    };
    'GET/ecpapi/v2/check': {
        Req: {
            __scene?: string;
        };
        Res: {
            app?: string;
            message?: string;
        };
    };
    'GET/ecpapi/v2/cluster/{uuid}/detail': {
        Req: {
            uuid: string;
            __scene?: string;
        };
        Res: {
            detail?: {
                meta?: {
                    uuid?: string;
                    clusterKey?: string;
                    kubeConfig?: string;
                    azV1?: string;
                    azV2?: string;
                    displayName?: string;
                    region?: string;
                    segment?: string;
                    monitoringUrl?: string;
                    kubeApiserverType?: string;
                    ecpVersion?: string;
                    handleByGalio?: boolean;
                };
            };
        };
    };
    'POST/ecpapi/v2/clustermeta': {
        Req: {
            uuid?: string;
            clusterKey?: string;
            displayName?: string;
            kubeConfig?: string;
            azV1?: string;
            azV2?: string;
            monitoringUrl?: string;
            kubeApiserverType?: string;
            ecpVersion?: string;
            handleByGalio?: boolean;
            __scene?: string;
        };
        Res: {};
    };
    'GET/ecpapi/v2/clusters/{clusterName}/nodes': {
        Req: {
            clusterName: string;
            __scene?: string;
        };
        Res: {
            items?: {
                cluster?: string;
                metrics?: {
                    pods?: {
                        applied?: number;
                        used?: number;
                    };
                    cpu?: {
                        applied?: number;
                        used?: number;
                    };
                    mem?: {
                        applied?: number;
                        used?: number;
                    };
                };
                extraStatus?: unknown[];
                labels?: {};
                taints?: {
                    key?: string;
                    val?: string;
                    effect?: string;
                }[];
                nodeName?: string;
                ip?: string;
                status?: string;
                roles?: unknown[];
            }[];
            total?: number;
        };
    };
    'POST/ecpapi/v2/sdus/{sduName}/deployments': {
        Req: {
            __scene?: string;
            sduName?: string;
        };
        Res: {
            deployId?: string;
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys': {
        Req: {
            sduName: string;
            withdetail?: boolean;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {
            status?: {};
            reason?: string;
        };
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart': {
        Req: {
            sduName: string;
            deployId: string;
            phases: string[];
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback': {
        Req: {
            __scene?: string;
            sduName?: string;
            deployId?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale': {
        Req: {
            releaseReplicas?: number;
            canaryReplicas?: number;
            canaryValid?: boolean;
            __scene?: string;
            sduName?: string;
            deployId?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {};
    };
    'GET/ecpapi/v2/workloads': {
        Req: {
            version?: string;
            env?: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/hpas': {
        Req: {
            sduName: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/summary': {
        Req: {
            sduName: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/services/{serviceId}/sdus': {
        Req: {
            serviceId: string;
            filterBy?: string;
            keyword?: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods': {
        Req: {
            sduName: string;
            deployId: string;
            __scene?: string;
        };
        Res: {
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
        };
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': {
        Req: {
            sduName: string;
            deployId: string;
            podName: string;
            clusterName: string;
            namespace: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics': {
        Req: {
            deployId: string;
            pods: {
                podName: string;
                namespace: string;
            }[];
            sduName: string;
            __scene?: string;
            metrics?: string;
        };
        Res: {
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
        };
    };
}
declare type ResSelector<T> = T;
export interface IResponseTypes {
    'GET/api/v1/ping': ResSelector<IModels['GET/api/v1/ping']['Res']>;
    'GET/ecpapi/v2/az/{azKey}/mapping': ResSelector<IModels['GET/ecpapi/v2/az/{azKey}/mapping']['Res']>;
    'GET/ecpapi/v2/azs': ResSelector<IModels['GET/ecpapi/v2/azs']['Res']>;
    'GET/ecpapi/v2/check': ResSelector<IModels['GET/ecpapi/v2/check']['Res']>;
    'GET/ecpapi/v2/cluster/{uuid}/detail': ResSelector<IModels['GET/ecpapi/v2/cluster/{uuid}/detail']['Res']>;
    'POST/ecpapi/v2/clustermeta': ResSelector<IModels['POST/ecpapi/v2/clustermeta']['Res']>;
    'GET/ecpapi/v2/clusters/{clusterName}/nodes': ResSelector<IModels['GET/ecpapi/v2/clusters/{clusterName}/nodes']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/deployments': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/deployments']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']['Res']>;
    'GET/ecpapi/v2/workloads': ResSelector<IModels['GET/ecpapi/v2/workloads']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/hpas': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/hpas']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/summary': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/summary']['Res']>;
    'GET/ecpapi/v2/services/{serviceId}/sdus': ResSelector<IModels['GET/ecpapi/v2/services/{serviceId}/sdus']['Res']>;
    'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods': ResSelector<IModels['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill']['Res']>;
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics': ResSelector<IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics']['Res']>;
}
export declare function createFetch(fetchConfig: commonLib.RequesterOption, extraConfig?: {
    fetchType?: commonLib.FetchType;
}): {
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
export {};

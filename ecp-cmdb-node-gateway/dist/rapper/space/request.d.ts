import * as commonLib from '@infra/rapper/runtime/commonLib';
export interface IModels {
    'POST/v1/depconf/binding/bind_service': {
        Req: {
            project?: string;
            service_id?: number;
            service_name?: string;
            __scene?: string;
        };
        Res: {
            created_at?: number;
            deleted_at?: number;
            project?: string;
            service_id?: number;
            service_name?: string;
            success: boolean;
        };
    };
    'GET/v1/depconf/binding/list': {
        Req: {
            project?: string;
            service_id?: number;
            disabled?: string;
            __scene?: string;
        };
        Res: {
            projects?: {
                created_at?: number;
                service_id?: number;
                deleted_at?: number;
                service_name?: string;
                project?: string;
            }[];
            success: boolean;
        };
    };
    'POST/v1/depconf/binding/unbind_service': {
        Req: {
            service_id?: number;
            __scene?: string;
        };
        Res: {
            success: boolean;
        };
    };
    'POST/v1/depconf/commit/copy_to': {
        Req: {
            comment?: string;
            from_commit_id?: number;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            targets?: unknown[];
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/commit/create': {
        Req: {
            comment?: string;
            data?: string;
            email?: string;
            env?: string;
            extra_data?: string;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'GET/v1/depconf/commit/get_info': {
        Req: {
            project?: string;
            service_id?: string;
            env: string;
            commit_id?: string;
            page?: number;
            limit?: number;
            __scene?: string;
        };
        Res: {
            commits: {
                env: string;
                comment: string;
                created_by: string;
                data: string;
                extra_data: {};
                created_time: number;
                project: string;
                id: number;
                service_id: number;
                service_meta_type: string;
            }[];
            success: boolean;
            total_count: number;
        };
    };
    'GET/v1/depconf/commit/get_latest_changes': {
        Req: {
            project?: string;
            service_id?: string;
            env?: string;
            last_n?: number;
            __scene?: string;
        };
        Res: {
            commits?: {
                service_id?: number;
                service_meta_type?: string;
                comment?: string;
                id?: number;
                project?: string;
                data?: string;
                extra_data?: {};
                env?: string;
                created_time?: number;
                created_by?: string;
            }[];
            success: boolean;
            total_count?: number;
        };
    };
    'POST/v1/depconf/config/add_deployment_zone': {
        Req: {
            project?: string;
            service_id?: number;
            zones?: {
                definition?: {
                    envs?: {
                        container?: {
                            resources?: {
                                cpu?: number;
                                disk?: number;
                                gpu?: number;
                                mem?: number;
                                skip_mem_limit_check?: boolean;
                            };
                            scheduler?: {
                                assignment_policies?: {
                                    name?: string;
                                    parameters?: {
                                        unique_key?: string;
                                        max_instances?: number;
                                        selectors?: {
                                            value?: string;
                                            key?: string;
                                            values?: unknown[];
                                            operator?: string;
                                        }[];
                                    };
                                }[];
                            };
                            canary?: {
                                multi_stage?: {
                                    final?: string;
                                    stages?: unknown[];
                                };
                                instances?: string;
                                mode?: string;
                            };
                            enabled?: boolean;
                            instances?: number;
                            minimum_instances?: number;
                            strategy?: {
                                name?: string;
                                parameters?: {
                                    canary_stages?: unknown[];
                                    disable_restart?: boolean;
                                    enable_canary_replacement?: boolean;
                                    in_place?: boolean;
                                    max_surge?: string;
                                    max_unavailable?: string;
                                    reserve_resources?: boolean;
                                    step_down?: number;
                                    strict_in_place?: boolean;
                                    threshold?: number;
                                    instances_per_agent?: number;
                                };
                            };
                        };
                        env?: string;
                        static_files?: {
                            enabled?: boolean;
                        };
                    }[];
                };
                dz_type?: string;
                zone_id?: number;
            }[];
            __scene?: string;
        };
        Res: {
            bound_zones?: {
                id?: number;
                zone_type?: string;
                zone_val?: number;
                full_name?: string;
                envs?: unknown[];
                name?: string;
                namespace?: string;
            }[];
            success: boolean;
        };
    };
    'POST/v1/depconf/config/bulk_get_field': {
        Req: {
            env?: string;
            fields?: unknown[];
            limit?: number;
            next_id?: number;
            project_modules?: unknown[];
            service_ids?: unknown[];
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {
            configs?: {
                data?: {
                    annotations?: {};
                    strategy?: {
                        parameters?: {
                            canary_stages?: unknown[];
                            instances_per_agent?: number;
                            enable_canary_replacement?: boolean;
                            disable_restart?: boolean;
                            in_place?: boolean;
                            max_surge?: string;
                            max_unavailable?: string;
                            strict_in_place?: boolean;
                            reserve_resources?: boolean;
                            threshold?: number;
                            step_down?: number;
                        };
                        name?: string;
                    };
                    instances?: number;
                    canary_percent?: number;
                    minimum_instances?: number;
                    canary_instances?: number;
                    scheduler?: {
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                unique_key?: string;
                                max_instances?: number;
                                selectors?: {
                                    value?: string;
                                    key?: string;
                                    operator?: string;
                                    values?: unknown[];
                                }[];
                            };
                        }[];
                        orchestrator?: string;
                    };
                    resources?: {
                        cpu?: number;
                        disk?: number;
                        mem?: number;
                        gpu?: number;
                    };
                };
                service_id?: number;
                az?: string;
                cid?: string;
                project_module?: string;
                env?: string;
            }[];
        };
    };
    'POST/v1/depconf/config/delete': {
        Req: {
            email?: string;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {
            success: boolean;
        };
    };
    'POST/v1/depconf/config/delete_deployment_zone': {
        Req: {
            dz_type: string;
            project?: string;
            service_id?: number;
            zone_ids?: unknown[];
            __scene?: string;
        };
        Res: {
            success: boolean;
        };
    };
    'GET/v1/depconf/config/get_all': {
        Req: {
            env?: string;
            next_id?: number;
            limit?: number;
            __scene?: string;
        };
        Res: {
            configurations?: {
                comment?: string;
                data?: string;
                commit_id?: number;
                created_ts?: number;
                deleted_at?: number;
                service_meta_type?: string;
                created_by?: string;
                env?: string;
                extra_data?: {};
                id?: number;
                modified_by?: string;
                modified_ts?: number;
                project?: string;
                service_id?: number;
            }[];
            meta?: {
                has_next?: boolean;
                next_id?: number;
            };
            success: boolean;
            total_count?: number;
        };
    };
    'GET/v1/depconf/config/get_cids': {
        Req: {
            project?: string;
            service_id?: string;
            env: string;
            __scene?: string;
        };
        Res: {
            cids?: unknown[];
            success: boolean;
        };
    };
    'GET/v1/depconf/config/get_generated': {
        Req: {
            project?: string;
            service_id?: string;
            env: string;
            __scene?: string;
        };
        Res: {
            configurations?: {
                commit_id?: number;
                env?: string;
                comment?: string;
                data?: string;
                service_meta_type?: string;
                created_by?: string;
                created_ts?: number;
                deleted_at?: number;
                extra_data?: {};
                project?: string;
                id?: number;
                service_id?: number;
                modified_by?: string;
                modified_ts?: number;
            }[];
            success: boolean;
            total_count?: number;
        };
    };
    'GET/v1/depconf/config/get_info': {
        Req: {
            project?: string;
            service_id?: string;
            env: string;
            __scene?: string;
        };
        Res: {
            configurations?: {
                comment?: string;
                created_by?: string;
                commit_id?: number;
                service_meta_type?: string;
                created_ts?: number;
                extra_data?: {};
                deleted_at?: number;
                data?: string;
                env?: string;
                project?: string;
                modified_by?: string;
                modified_ts?: number;
                service_id?: number;
                id?: number;
            }[];
            success: boolean;
            total_count?: number;
        };
    };
    'GET/v1/depconf/config/get_minimum_instance': {
        Req: {
            project?: string;
            env: string;
            cid: string;
            az: string;
            __scene?: string;
        };
        Res: {
            success: boolean;
            value?: number;
        };
    };
    'GET/v1/depconf/config/list_deployment_zone': {
        Req: {
            project?: string;
            service_id?: string;
            __scene?: string;
        };
        Res: {
            success: boolean;
            zones?: {
                full_name?: string;
                envs?: unknown[];
                id?: number;
                name?: string;
                namespace?: string;
                zone_type?: string;
                zone_val?: number;
            }[];
        };
    };
    'POST/v1/depconf/config/update_idc': {
        Req: {
            cid: string;
            comment?: string;
            env: string;
            idcs: unknown[];
            operation?: string;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/config/update_instance': {
        Req: {
            project: string;
            env: string;
            cid: string;
            idc?: string;
            count: string;
            comment?: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/config/update_instances': {
        Req: {
            comment?: string;
            email?: string;
            env: string;
            project?: string;
            requests?: {
                cid: string;
                count: number;
                idc: string;
            }[];
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/config/update_orchestrator': {
        Req: {
            cid?: string;
            email?: string;
            env?: string;
            idcs?: unknown[];
            orchestrator?: string;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/config/update_overcommits': {
        Req: {
            comment?: string;
            email?: string;
            env: string;
            project?: string;
            requests?: {
                idc: string;
                cid: string;
                overcommit_factor: number;
                usage_class?: string;
                overcommit_policy: string;
            }[];
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'POST/v1/depconf/config/update_resource': {
        Req: {
            comment?: string;
            cpu: number;
            env: string;
            mem: number;
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {};
    };
    'GET/v1/depconf/deploymentzone/list': {
        Req: {
            __scene?: string;
        };
        Res: {
            success: boolean;
            zones?: {
                envs?: unknown[];
                full_name?: string;
                id?: number;
                name?: string;
                zone_type?: string;
                namespace?: string;
                zone_val?: number;
            }[];
        };
    };
    'GET/v1/depconf/hierarchy_config/get_all': {
        Req: {
            __scene?: string;
        };
        Res: {
            configs?: {
                deleted_ts?: number;
                deployment_zone?: string;
                az_v2?: string;
                az?: string;
                id?: number;
                key_id?: number;
                comment?: string;
                cid?: string;
                created_by?: string;
                data?: {
                    canary_instances?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        component_detail?: {
                            workload_type?: string;
                        };
                        cluster?: string;
                        enable_canary?: boolean;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                enable_canary_replacement?: boolean;
                                instances_per_agent?: number;
                                max_unavailable?: string;
                                reserve_resources?: boolean;
                                disable_restart?: boolean;
                                canary_stages?: unknown[];
                                max_surge?: string;
                                in_place?: boolean;
                                threshold?: number;
                                step_down?: number;
                                strict_in_place?: boolean;
                            };
                        };
                        replicas?: number;
                    }[];
                    resources?: {
                        cpu?: number;
                        disk?: number;
                        mem?: number;
                        gpu?: number;
                    };
                    strategy?: {
                        name?: string;
                        parameters?: {
                            disable_restart?: boolean;
                            instances_per_agent?: number;
                            threshold?: number;
                            canary_stages?: unknown[];
                            max_surge?: string;
                            enable_canary_replacement?: boolean;
                            in_place?: boolean;
                            max_unavailable?: string;
                            reserve_resources?: boolean;
                            step_down?: number;
                            strict_in_place?: boolean;
                        };
                    };
                    annotations?: {};
                    instances?: number;
                    canary_percent?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    minimum_instances?: number;
                    scheduler?: {
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                selectors?: {
                                    key?: string;
                                    operator?: string;
                                    value?: string;
                                    values?: unknown[];
                                }[];
                                max_instances?: number;
                                unique_key?: string;
                            };
                        }[];
                        orchestrator?: string;
                    };
                };
                created_ts?: number;
                enabled?: boolean;
                env?: string;
                dz_id?: number;
                dz_type?: string;
                key_type?: string;
                level?: number;
                middleware_data?: {
                    users?: string;
                    acl?: string;
                    dr_cluster?: string;
                    alias?: string;
                    dr_data_sync_method?: string;
                    dr_enable?: boolean;
                    password?: string;
                };
                path_names?: unknown[];
                project?: string;
                service_meta_type?: string;
                updated_ts?: number;
                version?: number;
                service_id?: number;
                path?: string;
            }[];
            meta?: {
                has_next?: boolean;
                next_id?: number;
            };
            success: boolean;
            total_count?: number;
        };
    };
    'GET/v1/depconf/hierarchy_config/get_generated': {
        Req: {
            project: string;
            service_id: string;
            dz_type: string;
            env: string;
            cid: string;
            cid_group: string;
            __scene?: string;
        };
        Res: {
            configs?: {
                az?: string;
                az_v2?: string;
                cid?: string;
                data?: {
                    scheduler?: {
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                selectors?: {
                                    key?: string;
                                    value?: string;
                                    operator?: string;
                                    values?: unknown[];
                                }[];
                                max_instances?: number;
                                unique_key?: string;
                            };
                        }[];
                        orchestrator?: string;
                    };
                    strategy?: {
                        name?: string;
                        parameters?: {
                            strict_in_place?: boolean;
                            disable_restart?: boolean;
                            canary_stages?: unknown[];
                            enable_canary_replacement?: boolean;
                            max_unavailable?: string;
                            instances_per_agent?: number;
                            in_place?: boolean;
                            max_surge?: string;
                            step_down?: number;
                            reserve_resources?: boolean;
                            threshold?: number;
                        };
                    };
                    annotations?: {};
                    canary_instances?: number;
                    canary_percent?: number;
                    instances?: number;
                    minimum_instances?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    ecp_cluster_configs?: {
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                canary_stages?: unknown[];
                                instances_per_agent?: number;
                                in_place?: boolean;
                                disable_restart?: boolean;
                                enable_canary_replacement?: boolean;
                                reserve_resources?: boolean;
                                max_surge?: string;
                                max_unavailable?: string;
                                step_down?: number;
                                strict_in_place?: boolean;
                                threshold?: number;
                            };
                        };
                        cluster?: string;
                        canary_init_count?: number;
                        component_detail?: {
                            workload_type?: string;
                        };
                        replicas?: number;
                        enable_canary?: boolean;
                    }[];
                    resources?: {
                        cpu?: number;
                        disk?: number;
                        gpu?: number;
                        mem?: number;
                    };
                };
                deployment_zone_enum?: number;
                deployment_zone_name?: string;
                env?: string;
                deployment_zone_type?: string;
            }[];
            project?: string;
            service_id?: number;
            success: boolean;
        };
    };
    'GET/v1/depconf/hierarchy_config/get_info': {
        Req: {
            project: string;
            service_id: string;
            dz_type: string;
            level?: string;
            path?: string;
            __scene?: string;
        };
        Res: {
            configs?: {
                az?: string;
                dz_type?: string;
                enabled?: boolean;
                cid?: string;
                az_v2?: string;
                env?: string;
                comment?: string;
                created_by?: string;
                middleware_data?: {
                    acl?: string;
                    alias?: string;
                    dr_enable?: boolean;
                    dr_cluster?: string;
                    dr_data_sync_method?: string;
                    password?: string;
                    users?: string;
                };
                created_ts?: number;
                dz_id?: number;
                data?: {
                    component_detail?: {
                        workload_type?: string;
                    };
                    minimum_instances?: number;
                    canary_percent?: number;
                    annotations?: {};
                    canary_instances?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        cluster?: string;
                        component_detail?: {
                            workload_type?: string;
                        };
                        enable_canary?: boolean;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                enable_canary_replacement?: boolean;
                                threshold?: number;
                                disable_restart?: boolean;
                                canary_stages?: unknown[];
                                max_surge?: string;
                                strict_in_place?: boolean;
                                reserve_resources?: boolean;
                                step_down?: number;
                                max_unavailable?: string;
                                instances_per_agent?: number;
                                in_place?: boolean;
                            };
                        };
                        replicas?: number;
                    }[];
                    instances?: number;
                    resources?: {
                        disk?: number;
                        cpu?: number;
                        mem?: number;
                        gpu?: number;
                    };
                    scheduler?: {
                        orchestrator?: string;
                        assignment_policies?: {
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    value?: string;
                                    key?: string;
                                    operator?: string;
                                    values?: unknown[];
                                }[];
                                unique_key?: string;
                            };
                            name?: string;
                        }[];
                    };
                    strategy?: {
                        parameters?: {
                            canary_stages?: unknown[];
                            step_down?: number;
                            strict_in_place?: boolean;
                            disable_restart?: boolean;
                            threshold?: number;
                            enable_canary_replacement?: boolean;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            reserve_resources?: boolean;
                            max_surge?: string;
                            max_unavailable?: string;
                        };
                        name?: string;
                    };
                };
                deleted_ts?: number;
                deployment_zone?: string;
                service_id?: number;
                id?: number;
                version?: number;
                key_type?: string;
                key_id?: number;
                level?: number;
                path?: string;
                path_names?: unknown[];
                updated_ts?: number;
                project?: string;
                service_meta_type?: string;
            }[];
            success: boolean;
            total_count?: number;
        };
    };
    'POST/v1/depconf/hierarchy_config_commit/create': {
        Req: {
            comment?: string;
            payloads?: {
                env?: string;
                az?: string;
                level: number;
                config: {
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        component_detail?: {
                            workload_type?: string;
                        };
                        cluster?: string;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                enable_canary_replacement?: boolean;
                                in_place?: boolean;
                                strict_in_place?: boolean;
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                instances_per_agent?: number;
                                reserve_resources?: boolean;
                                max_surge?: string;
                                max_unavailable?: string;
                                step_down?: number;
                                threshold?: number;
                            };
                        };
                        replicas?: number;
                        enable_canary?: boolean;
                    }[];
                    minimum_instances?: number;
                    annotations?: {};
                    strategy?: {
                        name?: string;
                        parameters?: {
                            canary_stages?: unknown[];
                            disable_restart?: boolean;
                            reserve_resources?: boolean;
                            enable_canary_replacement?: boolean;
                            max_surge?: string;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            strict_in_place?: boolean;
                            threshold?: number;
                            step_down?: number;
                            max_unavailable?: string;
                        };
                    };
                    canary_instances?: number;
                    canary_percent?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    resources?: {
                        mem?: number;
                        cpu?: number;
                        disk?: number;
                        gpu?: number;
                    };
                    instances?: number;
                    scheduler?: {
                        orchestrator?: string;
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    value?: string;
                                    key?: string;
                                    operator?: string;
                                    values?: unknown[];
                                }[];
                                unique_key?: string;
                            };
                        }[];
                    };
                };
                cid?: string;
                az_v2?: string;
                deployment_zone?: string;
                dz_type: string;
                version?: number;
            }[];
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            __scene?: string;
        };
        Res: {
            commits?: {
                comment?: string;
                created_ts?: number;
                data?: {
                    annotations?: {};
                    canary_instances?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        enable_canary?: boolean;
                        cluster?: string;
                        component_detail?: {
                            workload_type?: string;
                        };
                        replicas?: number;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                max_unavailable?: string;
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                instances_per_agent?: number;
                                in_place?: boolean;
                                step_down?: number;
                                max_surge?: string;
                                reserve_resources?: boolean;
                                strict_in_place?: boolean;
                                threshold?: number;
                                enable_canary_replacement?: boolean;
                            };
                        };
                    }[];
                    scheduler?: {
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    operator?: string;
                                    key?: string;
                                    values?: unknown[];
                                    value?: string;
                                }[];
                                unique_key?: string;
                            };
                        }[];
                        orchestrator?: string;
                    };
                    strategy?: {
                        name?: string;
                        parameters?: {
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            canary_stages?: unknown[];
                            in_place?: boolean;
                            instances_per_agent?: number;
                            max_surge?: string;
                            reserve_resources?: boolean;
                            max_unavailable?: string;
                            step_down?: number;
                            strict_in_place?: boolean;
                            threshold?: number;
                        };
                    };
                    canary_percent?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    resources?: {
                        cpu?: number;
                        disk?: number;
                        mem?: number;
                        gpu?: number;
                    };
                    minimum_instances?: number;
                    instances?: number;
                };
                az?: string;
                created_by?: string;
                az_v2?: string;
                cid?: string;
                path?: string;
                dz_type?: string;
                enabled?: boolean;
                id?: number;
                level?: number;
                middleware_data?: {
                    password?: string;
                    acl?: string;
                    alias?: string;
                    dr_enable?: boolean;
                    dr_cluster?: string;
                    dr_data_sync_method?: string;
                    users?: string;
                };
                service_meta_type?: string;
                project?: string;
                version?: number;
                env?: string;
                key_type?: string;
                key_id?: number;
            }[];
            success: boolean;
        };
    };
    'GET/v1/depconf/hierarchy_config_commit/get_info': {
        Req: {
            project: string;
            service_id: string;
            dz_type: string;
            level?: string;
            next_id?: number;
            limit?: number;
            get_children?: boolean;
            __scene?: string;
        };
        Res: {
            commits?: {
                az?: string;
                dz_type?: string;
                cid?: string;
                data?: {
                    minimum_instances?: number;
                    annotations?: {};
                    canary_instances?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        component_detail?: {
                            workload_type?: string;
                        };
                        cluster?: string;
                        enable_canary?: boolean;
                        replicas?: number;
                        strategy_definition?: {
                            parameters?: {
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                strict_in_place?: boolean;
                                reserve_resources?: boolean;
                                in_place?: boolean;
                                enable_canary_replacement?: boolean;
                                step_down?: number;
                                max_unavailable?: string;
                                threshold?: number;
                                instances_per_agent?: number;
                                max_surge?: string;
                            };
                            name?: string;
                        };
                    }[];
                    canary_percent?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    instances?: number;
                    resources?: {
                        disk?: number;
                        cpu?: number;
                        gpu?: number;
                        mem?: number;
                    };
                    scheduler?: {
                        orchestrator?: string;
                        assignment_policies?: {
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    values?: unknown[];
                                    key?: string;
                                    operator?: string;
                                    value?: string;
                                }[];
                                unique_key?: string;
                            };
                            name?: string;
                        }[];
                    };
                    strategy?: {
                        name?: string;
                        parameters?: {
                            max_surge?: string;
                            canary_stages?: unknown[];
                            instances_per_agent?: number;
                            in_place?: boolean;
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            step_down?: number;
                            strict_in_place?: boolean;
                            max_unavailable?: string;
                            reserve_resources?: boolean;
                            threshold?: number;
                        };
                    };
                };
                comment?: string;
                created_by?: string;
                created_ts?: number;
                enabled?: boolean;
                key_id?: number;
                id?: number;
                env?: string;
                level?: number;
                project?: string;
                key_type?: string;
                middleware_data?: {
                    password?: string;
                    dr_cluster?: string;
                    acl?: string;
                    alias?: string;
                    dr_data_sync_method?: string;
                    dr_enable?: boolean;
                    users?: string;
                };
                path?: string;
                az_v2?: string;
                service_meta_type?: string;
                version?: number;
            }[];
            success: boolean;
        };
    };
    'GET/v1/depconf/meta/get_orchestrators': {
        Req: {
            service_name?: string;
            __scene?: string;
        };
        Res: {
            not_active?: {
                env: string;
                idc: string;
            }[];
            orchestrators?: {};
        };
    };
    'GET/v1/depconf/meta/get_service_metadata': {
        Req: {
            service_name: string;
            service_id: number;
            __scene?: string;
        };
        Res: {
            show_dz_ui?: boolean;
        };
    };
    'GET/v2/app_model/hierarchy_config/get_all': {
        Req: {
            __scene?: string;
        };
        Res: {
            configs?: {
                data?: {
                    annotations?: {};
                    canary_percent?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                enable_canary_replacement?: boolean;
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                instances_per_agent?: number;
                                in_place?: boolean;
                                max_surge?: string;
                                max_unavailable?: string;
                                reserve_resources?: boolean;
                                strict_in_place?: boolean;
                                step_down?: number;
                                threshold?: number;
                            };
                        };
                        enable_canary?: boolean;
                        component_detail?: {
                            workload_type?: string;
                        };
                        cluster?: string;
                        replicas?: number;
                    }[];
                    canary_instances?: number;
                    instances?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    scheduler?: {
                        orchestrator?: string;
                        assignment_policies?: {
                            parameters?: {
                                max_instances?: number;
                                unique_key?: string;
                                selectors?: {
                                    operator?: string;
                                    key?: string;
                                    value?: string;
                                    values?: unknown[];
                                }[];
                            };
                            name?: string;
                        }[];
                    };
                    minimum_instances?: number;
                    resources?: {
                        gpu?: number;
                        disk?: number;
                        cpu?: number;
                        mem?: number;
                    };
                    strategy?: {
                        parameters?: {
                            canary_stages?: unknown[];
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            strict_in_place?: boolean;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            max_surge?: string;
                            reserve_resources?: boolean;
                            max_unavailable?: string;
                            step_down?: number;
                            threshold?: number;
                        };
                        name?: string;
                    };
                };
                dz_id?: number;
                az?: string;
                az_v2?: string;
                created_by?: string;
                key_id?: number;
                cid?: string;
                level?: number;
                comment?: string;
                created_ts?: number;
                deleted_ts?: number;
                dz_type?: string;
                deployment_zone?: string;
                service_meta_type?: string;
                enabled?: boolean;
                id?: number;
                env?: string;
                key_type?: string;
                path?: string;
                middleware_data?: {
                    dr_cluster?: string;
                    acl?: string;
                    alias?: string;
                    password?: string;
                    dr_data_sync_method?: string;
                    dr_enable?: boolean;
                    users?: string;
                };
                project?: string;
                path_names?: unknown[];
                updated_ts?: number;
                service_id?: number;
                version?: number;
            }[];
            meta?: {
                has_next?: boolean;
                next_id?: number;
            };
            success: boolean;
            total_count?: number;
        };
    };
    'GET/v2/app_model/hierarchy_config/get_info': {
        Req: {
            project: string;
            service_id: string;
            service_meta_type: string;
            dz_type: string;
            level?: string;
            __scene?: string;
        };
        Res: {
            configs?: {
                az_v2?: string;
                cid?: string;
                az?: string;
                env?: string;
                comment?: string;
                created_by?: string;
                path?: string;
                created_ts?: number;
                data?: {
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        enable_canary?: boolean;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                enable_canary_replacement?: boolean;
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                max_surge?: string;
                                in_place?: boolean;
                                instances_per_agent?: number;
                                max_unavailable?: string;
                                reserve_resources?: boolean;
                                step_down?: number;
                                strict_in_place?: boolean;
                                threshold?: number;
                            };
                        };
                        cluster?: string;
                        component_detail?: {
                            workload_type?: string;
                        };
                        replicas?: number;
                    }[];
                    scheduler?: {
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    key?: string;
                                    values?: unknown[];
                                    operator?: string;
                                    value?: string;
                                }[];
                                unique_key?: string;
                            };
                        }[];
                        orchestrator?: string;
                    };
                    canary_percent?: number;
                    annotations?: {};
                    canary_instances?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    instances?: number;
                    minimum_instances?: number;
                    resources?: {
                        disk?: number;
                        cpu?: number;
                        gpu?: number;
                        mem?: number;
                    };
                    strategy?: {
                        parameters?: {
                            max_unavailable?: string;
                            canary_stages?: unknown[];
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            max_surge?: string;
                            strict_in_place?: boolean;
                            reserve_resources?: boolean;
                            threshold?: number;
                            step_down?: number;
                        };
                        name?: string;
                    };
                };
                deleted_ts?: number;
                dz_id?: number;
                dz_type?: string;
                id?: number;
                key_id?: number;
                enabled?: boolean;
                key_type?: string;
                level?: number;
                path_names?: unknown[];
                service_id?: number;
                project?: string;
                service_meta_type?: string;
                updated_ts?: number;
                version?: number;
                middleware_data?: {
                    alias?: string;
                    dr_cluster?: string;
                    dr_data_sync_method?: string;
                    dr_enable?: boolean;
                    password?: string;
                    users?: string;
                    acl?: string;
                };
                deployment_zone?: string;
            }[];
            success: boolean;
            total_count?: number;
        };
    };
    'POST/v2/app_model/hierarchy_config_commit/create': {
        Req: {
            az?: string;
            az_v2?: string;
            cid?: string;
            comment?: string;
            config?: {
                annotations?: {};
                component_detail?: {
                    workload_type?: string;
                };
                canary_instances?: number;
                canary_percent?: number;
                ecp_cluster_configs?: {
                    strategy_definition?: {
                        name?: string;
                        parameters?: {
                            reserve_resources?: boolean;
                            canary_stages?: unknown[];
                            strict_in_place?: boolean;
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            max_surge?: string;
                            max_unavailable?: string;
                            step_down?: number;
                            threshold?: number;
                        };
                    };
                    canary_init_count?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    cluster?: string;
                    enable_canary?: boolean;
                    replicas?: number;
                }[];
                instances?: number;
                minimum_instances?: number;
                resources?: {
                    disk?: number;
                    cpu?: number;
                    mem?: number;
                    gpu?: number;
                };
                scheduler?: {
                    assignment_policies?: {
                        name?: string;
                        parameters?: {
                            selectors?: {
                                value?: string;
                                key?: string;
                                values?: unknown[];
                                operator?: string;
                            }[];
                            max_instances?: number;
                            unique_key?: string;
                        };
                    }[];
                    orchestrator?: string;
                };
                strategy?: {
                    parameters?: {
                        canary_stages?: unknown[];
                        enable_canary_replacement?: boolean;
                        instances_per_agent?: number;
                        disable_restart?: boolean;
                        in_place?: boolean;
                        step_down?: number;
                        max_surge?: string;
                        reserve_resources?: boolean;
                        max_unavailable?: string;
                        strict_in_place?: boolean;
                        threshold?: number;
                    };
                    name?: string;
                };
            };
            deployment_zone?: string;
            dz_type: string;
            env?: string;
            level?: number;
            middleware_config?: {
                dr_cluster?: string;
                dr_data_sync_method?: string;
                acl?: string;
                dr_enable?: boolean;
                alias?: string;
                users?: string;
                password?: string;
            };
            project?: string;
            service_id?: number;
            service_meta_type?: string;
            version?: number;
            __scene?: string;
        };
        Res: {
            commits?: {
                comment?: string;
                az?: string;
                az_v2?: string;
                data?: {
                    annotations?: {};
                    canary_percent?: number;
                    component_detail?: {
                        workload_type?: string;
                    };
                    canary_instances?: number;
                    minimum_instances?: number;
                    ecp_cluster_configs?: {
                        component_detail?: {
                            workload_type?: string;
                        };
                        canary_init_count?: number;
                        replicas?: number;
                        cluster?: string;
                        enable_canary?: boolean;
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                instances_per_agent?: number;
                                reserve_resources?: boolean;
                                enable_canary_replacement?: boolean;
                                step_down?: number;
                                canary_stages?: unknown[];
                                disable_restart?: boolean;
                                in_place?: boolean;
                                max_surge?: string;
                                threshold?: number;
                                max_unavailable?: string;
                                strict_in_place?: boolean;
                            };
                        };
                    }[];
                    instances?: number;
                    strategy?: {
                        name?: string;
                        parameters?: {
                            max_unavailable?: string;
                            step_down?: number;
                            canary_stages?: unknown[];
                            threshold?: number;
                            enable_canary_replacement?: boolean;
                            disable_restart?: boolean;
                            max_surge?: string;
                            in_place?: boolean;
                            instances_per_agent?: number;
                            reserve_resources?: boolean;
                            strict_in_place?: boolean;
                        };
                    };
                    resources?: {
                        disk?: number;
                        cpu?: number;
                        mem?: number;
                        gpu?: number;
                    };
                    scheduler?: {
                        assignment_policies?: {
                            parameters?: {
                                max_instances?: number;
                                selectors?: {
                                    operator?: string;
                                    key?: string;
                                    values?: unknown[];
                                    value?: string;
                                }[];
                                unique_key?: string;
                            };
                            name?: string;
                        }[];
                        orchestrator?: string;
                    };
                };
                enabled?: boolean;
                cid?: string;
                created_by?: string;
                dz_type?: string;
                created_ts?: number;
                env?: string;
                id?: number;
                key_id?: number;
                key_type?: string;
                path?: string;
                level?: number;
                middleware_data?: {
                    alias?: string;
                    acl?: string;
                    dr_data_sync_method?: string;
                    dr_cluster?: string;
                    password?: string;
                    dr_enable?: boolean;
                    users?: string;
                };
                service_meta_type?: string;
                project?: string;
                version?: number;
            }[];
            success: boolean;
        };
    };
    'GET/v2/app_model/hierarchy_config_commit/get_info': {
        Req: {
            project: string;
            service_id: string;
            service_meta_type: string;
            dz_type: string;
            level?: string;
            next_id?: number;
            limit?: number;
            __scene?: string;
        };
        Res: {
            commits?: {
                comment?: string;
                env?: string;
                az_v2?: string;
                az?: string;
                created_by?: string;
                level?: number;
                path?: string;
                created_ts?: number;
                data?: {
                    annotations?: {};
                    component_detail?: {
                        workload_type?: string;
                    };
                    canary_instances?: number;
                    canary_percent?: number;
                    ecp_cluster_configs?: {
                        canary_init_count?: number;
                        cluster?: string;
                        component_detail?: {
                            workload_type?: string;
                        };
                        strategy_definition?: {
                            name?: string;
                            parameters?: {
                                max_unavailable?: string;
                                disable_restart?: boolean;
                                in_place?: boolean;
                                enable_canary_replacement?: boolean;
                                canary_stages?: unknown[];
                                instances_per_agent?: number;
                                max_surge?: string;
                                reserve_resources?: boolean;
                                strict_in_place?: boolean;
                                threshold?: number;
                                step_down?: number;
                            };
                        };
                        replicas?: number;
                        enable_canary?: boolean;
                    }[];
                    instances?: number;
                    resources?: {
                        gpu?: number;
                        disk?: number;
                        cpu?: number;
                        mem?: number;
                    };
                    minimum_instances?: number;
                    scheduler?: {
                        orchestrator?: string;
                        assignment_policies?: {
                            name?: string;
                            parameters?: {
                                selectors?: {
                                    key?: string;
                                    value?: string;
                                    operator?: string;
                                    values?: unknown[];
                                }[];
                                max_instances?: number;
                                unique_key?: string;
                            };
                        }[];
                    };
                    strategy?: {
                        name?: string;
                        parameters?: {
                            in_place?: boolean;
                            threshold?: number;
                            canary_stages?: unknown[];
                            instances_per_agent?: number;
                            disable_restart?: boolean;
                            enable_canary_replacement?: boolean;
                            max_unavailable?: string;
                            reserve_resources?: boolean;
                            max_surge?: string;
                            step_down?: number;
                            strict_in_place?: boolean;
                        };
                    };
                };
                dz_type?: string;
                enabled?: boolean;
                key_type?: string;
                middleware_data?: {
                    alias?: string;
                    dr_data_sync_method?: string;
                    password?: string;
                    acl?: string;
                    users?: string;
                    dr_cluster?: string;
                    dr_enable?: boolean;
                };
                key_id?: number;
                id?: number;
                service_meta_type?: string;
                project?: string;
                version?: number;
                cid?: string;
            }[];
            success: boolean;
        };
    };
    'GET/v2/app_model/meta/get_service_meta_types': {
        Req: {
            __scene?: string;
        };
        Res: {
            types?: {
                name?: string;
                service_meta_type?: string;
            }[];
        };
    };
    'GET/apis/autoscaler/v1/service/acknowledgement_status': {
        Req: {
            project: string;
            module: string;
            __scene?: string;
        };
        Res: {
            error_code: number;
            error_message: string;
            toggle_state: number;
        };
    };
    'GET/apis/cmdb/v2/service/get_unbounded_sdus': {
        Req: {
            resource_type?: string;
            __scene?: string;
        };
        Res: {
            sdu: {
                sdu: string;
                resource_type: string;
                env: string;
                cid: string;
                idcs: unknown[];
                version: string;
                deployment_link: string;
                label: {};
                created_at: number;
                updated_at: number;
            }[];
            total_size: number;
        };
    };
    'POST/apis/cmdb/v2/service/bind_sdu': {
        Req: {
            service_name: string;
            resource_type: string;
            sdu: string;
            force?: boolean;
            __scene?: string;
        };
        Res: {
            bounded: {
                service: {
                    service_id: number;
                    service_name: string;
                    data: {
                        spexible: string;
                    };
                    updated_by: string;
                    service_owners: unknown[];
                    enabled: boolean;
                    created_at: number;
                    updated_at: number;
                };
                sdu: {
                    sdu: string;
                    sdu_type: string;
                    env: string;
                    cid: string;
                    idcs: string[];
                    version: string;
                    deployment_link: string;
                    label: {};
                    created_at: number;
                    updated_at: number;
                };
                bind: {
                    service_sdu_relation_id: number;
                    service_id: number;
                    sdu_id: number;
                    enabled: boolean;
                    created_at: number;
                    updated_at: number;
                };
            }[];
        };
    };
    'POST/apis/cmdb/v2/service/unbind_sdu': {
        Req: {
            service_name: string;
            resource_type: string;
            sdu: string;
            force?: boolean;
            __scene?: string;
        };
        Res: {
            unbounded: {
                service: {
                    service_id: number;
                    service_name: string;
                    data: {
                        spexible: string;
                    };
                    updated_by: string;
                    service_owners: unknown[];
                    enabled: boolean;
                    created_at: number;
                    updated_at: number;
                };
                sdu: {
                    sdu: string;
                    resource_type: string;
                    env: string;
                    cid: string;
                    idcs: string[];
                    version: string;
                    deployment_link: string;
                    label: {};
                    created_at: number;
                    updated_at: number;
                };
                unbind: {
                    service_sdu_relation_id: number;
                    service_id: number;
                    sdu_id: number;
                    enabled: boolean;
                    created_at: number;
                    updated_at: number;
                };
            }[];
        };
    };
}
declare type ResSelector<T> = T;
export interface IResponseTypes {
    'POST/v1/depconf/binding/bind_service': ResSelector<IModels['POST/v1/depconf/binding/bind_service']['Res']>;
    'GET/v1/depconf/binding/list': ResSelector<IModels['GET/v1/depconf/binding/list']['Res']>;
    'POST/v1/depconf/binding/unbind_service': ResSelector<IModels['POST/v1/depconf/binding/unbind_service']['Res']>;
    'POST/v1/depconf/commit/copy_to': ResSelector<IModels['POST/v1/depconf/commit/copy_to']['Res']>;
    'POST/v1/depconf/commit/create': ResSelector<IModels['POST/v1/depconf/commit/create']['Res']>;
    'GET/v1/depconf/commit/get_info': ResSelector<IModels['GET/v1/depconf/commit/get_info']['Res']>;
    'GET/v1/depconf/commit/get_latest_changes': ResSelector<IModels['GET/v1/depconf/commit/get_latest_changes']['Res']>;
    'POST/v1/depconf/config/add_deployment_zone': ResSelector<IModels['POST/v1/depconf/config/add_deployment_zone']['Res']>;
    'POST/v1/depconf/config/bulk_get_field': ResSelector<IModels['POST/v1/depconf/config/bulk_get_field']['Res']>;
    'POST/v1/depconf/config/delete': ResSelector<IModels['POST/v1/depconf/config/delete']['Res']>;
    'POST/v1/depconf/config/delete_deployment_zone': ResSelector<IModels['POST/v1/depconf/config/delete_deployment_zone']['Res']>;
    'GET/v1/depconf/config/get_all': ResSelector<IModels['GET/v1/depconf/config/get_all']['Res']>;
    'GET/v1/depconf/config/get_cids': ResSelector<IModels['GET/v1/depconf/config/get_cids']['Res']>;
    'GET/v1/depconf/config/get_generated': ResSelector<IModels['GET/v1/depconf/config/get_generated']['Res']>;
    'GET/v1/depconf/config/get_info': ResSelector<IModels['GET/v1/depconf/config/get_info']['Res']>;
    'GET/v1/depconf/config/get_minimum_instance': ResSelector<IModels['GET/v1/depconf/config/get_minimum_instance']['Res']>;
    'GET/v1/depconf/config/list_deployment_zone': ResSelector<IModels['GET/v1/depconf/config/list_deployment_zone']['Res']>;
    'POST/v1/depconf/config/update_idc': ResSelector<IModels['POST/v1/depconf/config/update_idc']['Res']>;
    'POST/v1/depconf/config/update_instance': ResSelector<IModels['POST/v1/depconf/config/update_instance']['Res']>;
    'POST/v1/depconf/config/update_instances': ResSelector<IModels['POST/v1/depconf/config/update_instances']['Res']>;
    'POST/v1/depconf/config/update_orchestrator': ResSelector<IModels['POST/v1/depconf/config/update_orchestrator']['Res']>;
    'POST/v1/depconf/config/update_overcommits': ResSelector<IModels['POST/v1/depconf/config/update_overcommits']['Res']>;
    'POST/v1/depconf/config/update_resource': ResSelector<IModels['POST/v1/depconf/config/update_resource']['Res']>;
    'GET/v1/depconf/deploymentzone/list': ResSelector<IModels['GET/v1/depconf/deploymentzone/list']['Res']>;
    'GET/v1/depconf/hierarchy_config/get_all': ResSelector<IModels['GET/v1/depconf/hierarchy_config/get_all']['Res']>;
    'GET/v1/depconf/hierarchy_config/get_generated': ResSelector<IModels['GET/v1/depconf/hierarchy_config/get_generated']['Res']>;
    'GET/v1/depconf/hierarchy_config/get_info': ResSelector<IModels['GET/v1/depconf/hierarchy_config/get_info']['Res']>;
    'POST/v1/depconf/hierarchy_config_commit/create': ResSelector<IModels['POST/v1/depconf/hierarchy_config_commit/create']['Res']>;
    'GET/v1/depconf/hierarchy_config_commit/get_info': ResSelector<IModels['GET/v1/depconf/hierarchy_config_commit/get_info']['Res']>;
    'GET/v1/depconf/meta/get_orchestrators': ResSelector<IModels['GET/v1/depconf/meta/get_orchestrators']['Res']>;
    'GET/v1/depconf/meta/get_service_metadata': ResSelector<IModels['GET/v1/depconf/meta/get_service_metadata']['Res']>;
    'GET/v2/app_model/hierarchy_config/get_all': ResSelector<IModels['GET/v2/app_model/hierarchy_config/get_all']['Res']>;
    'GET/v2/app_model/hierarchy_config/get_info': ResSelector<IModels['GET/v2/app_model/hierarchy_config/get_info']['Res']>;
    'POST/v2/app_model/hierarchy_config_commit/create': ResSelector<IModels['POST/v2/app_model/hierarchy_config_commit/create']['Res']>;
    'GET/v2/app_model/hierarchy_config_commit/get_info': ResSelector<IModels['GET/v2/app_model/hierarchy_config_commit/get_info']['Res']>;
    'GET/v2/app_model/meta/get_service_meta_types': ResSelector<IModels['GET/v2/app_model/meta/get_service_meta_types']['Res']>;
    'GET/apis/autoscaler/v1/service/acknowledgement_status': ResSelector<IModels['GET/apis/autoscaler/v1/service/acknowledgement_status']['Res']>;
    'GET/apis/cmdb/v2/service/get_unbounded_sdus': ResSelector<IModels['GET/apis/cmdb/v2/service/get_unbounded_sdus']['Res']>;
    'POST/apis/cmdb/v2/service/bind_sdu': ResSelector<IModels['POST/apis/cmdb/v2/service/bind_sdu']['Res']>;
    'POST/apis/cmdb/v2/service/unbind_sdu': ResSelector<IModels['POST/apis/cmdb/v2/service/unbind_sdu']['Res']>;
}
export declare function createFetch(fetchConfig: commonLib.RequesterOption, extraConfig?: {
    fetchType?: commonLib.FetchType;
}): {
    'POST/v1/depconf/binding/bind_service': (req?: {
        project?: string | undefined;
        service_id?: number | undefined;
        service_name?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        created_at?: number | undefined;
        deleted_at?: number | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_name?: string | undefined;
        success: boolean;
    }>;
    'GET/v1/depconf/binding/list': (req?: {
        project?: string | undefined;
        service_id?: number | undefined;
        disabled?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        projects?: {
            created_at?: number | undefined;
            service_id?: number | undefined;
            deleted_at?: number | undefined;
            service_name?: string | undefined;
            project?: string | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'POST/v1/depconf/binding/unbind_service': (req?: {
        service_id?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
    }>;
    'POST/v1/depconf/commit/copy_to': (req?: {
        comment?: string | undefined;
        from_commit_id?: number | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        targets?: unknown[] | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/commit/create': (req?: {
        comment?: string | undefined;
        data?: string | undefined;
        email?: string | undefined;
        env?: string | undefined;
        extra_data?: string | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'GET/v1/depconf/commit/get_info': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        env: string;
        commit_id?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits: {
            env: string;
            comment: string;
            created_by: string;
            data: string;
            extra_data: {};
            created_time: number;
            project: string;
            id: number;
            service_id: number;
            service_meta_type: string;
        }[];
        success: boolean;
        total_count: number;
    }>;
    'GET/v1/depconf/commit/get_latest_changes': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        env?: string | undefined;
        last_n?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits?: {
            service_id?: number | undefined;
            service_meta_type?: string | undefined;
            comment?: string | undefined;
            id?: number | undefined;
            project?: string | undefined;
            data?: string | undefined;
            extra_data?: {} | undefined;
            env?: string | undefined;
            created_time?: number | undefined;
            created_by?: string | undefined;
        }[] | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'POST/v1/depconf/config/add_deployment_zone': (req?: {
        project?: string | undefined;
        service_id?: number | undefined;
        zones?: {
            definition?: {
                envs?: {
                    container?: {
                        resources?: {
                            cpu?: number | undefined;
                            disk?: number | undefined;
                            gpu?: number | undefined;
                            mem?: number | undefined;
                            skip_mem_limit_check?: boolean | undefined;
                        } | undefined;
                        scheduler?: {
                            assignment_policies?: {
                                name?: string | undefined;
                                parameters?: {
                                    unique_key?: string | undefined;
                                    max_instances?: number | undefined;
                                    selectors?: {
                                        value?: string | undefined;
                                        key?: string | undefined;
                                        values?: unknown[] | undefined;
                                        operator?: string | undefined;
                                    }[] | undefined;
                                } | undefined;
                            }[] | undefined;
                        } | undefined;
                        canary?: {
                            multi_stage?: {
                                final?: string | undefined;
                                stages?: unknown[] | undefined;
                            } | undefined;
                            instances?: string | undefined;
                            mode?: string | undefined;
                        } | undefined;
                        enabled?: boolean | undefined;
                        instances?: number | undefined;
                        minimum_instances?: number | undefined;
                        strategy?: {
                            name?: string | undefined;
                            parameters?: {
                                canary_stages?: unknown[] | undefined;
                                disable_restart?: boolean | undefined;
                                enable_canary_replacement?: boolean | undefined;
                                in_place?: boolean | undefined;
                                max_surge?: string | undefined;
                                max_unavailable?: string | undefined;
                                reserve_resources?: boolean | undefined;
                                step_down?: number | undefined;
                                strict_in_place?: boolean | undefined;
                                threshold?: number | undefined;
                                instances_per_agent?: number | undefined;
                            } | undefined;
                        } | undefined;
                    } | undefined;
                    env?: string | undefined;
                    static_files?: {
                        enabled?: boolean | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
            dz_type?: string | undefined;
            zone_id?: number | undefined;
        }[] | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        bound_zones?: {
            id?: number | undefined;
            zone_type?: string | undefined;
            zone_val?: number | undefined;
            full_name?: string | undefined;
            envs?: unknown[] | undefined;
            name?: string | undefined;
            namespace?: string | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'POST/v1/depconf/config/bulk_get_field': (req?: {
        env?: string | undefined;
        fields?: unknown[] | undefined;
        limit?: number | undefined;
        next_id?: number | undefined;
        project_modules?: unknown[] | undefined;
        service_ids?: unknown[] | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            data?: {
                annotations?: {} | undefined;
                strategy?: {
                    parameters?: {
                        canary_stages?: unknown[] | undefined;
                        instances_per_agent?: number | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        in_place?: boolean | undefined;
                        max_surge?: string | undefined;
                        max_unavailable?: string | undefined;
                        strict_in_place?: boolean | undefined;
                        reserve_resources?: boolean | undefined;
                        threshold?: number | undefined;
                        step_down?: number | undefined;
                    } | undefined;
                    name?: string | undefined;
                } | undefined;
                instances?: number | undefined;
                canary_percent?: number | undefined;
                minimum_instances?: number | undefined;
                canary_instances?: number | undefined;
                scheduler?: {
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            unique_key?: string | undefined;
                            max_instances?: number | undefined;
                            selectors?: {
                                value?: string | undefined;
                                key?: string | undefined;
                                operator?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                        } | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
                resources?: {
                    cpu?: number | undefined;
                    disk?: number | undefined;
                    mem?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
            } | undefined;
            service_id?: number | undefined;
            az?: string | undefined;
            cid?: string | undefined;
            project_module?: string | undefined;
            env?: string | undefined;
        }[] | undefined;
    }>;
    'POST/v1/depconf/config/delete': (req?: {
        email?: string | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
    }>;
    'POST/v1/depconf/config/delete_deployment_zone': (req?: {
        dz_type: string;
        project?: string | undefined;
        service_id?: number | undefined;
        zone_ids?: unknown[] | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
    }>;
    'GET/v1/depconf/config/get_all': (req?: {
        env?: string | undefined;
        next_id?: number | undefined;
        limit?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configurations?: {
            comment?: string | undefined;
            data?: string | undefined;
            commit_id?: number | undefined;
            created_ts?: number | undefined;
            deleted_at?: number | undefined;
            service_meta_type?: string | undefined;
            created_by?: string | undefined;
            env?: string | undefined;
            extra_data?: {} | undefined;
            id?: number | undefined;
            modified_by?: string | undefined;
            modified_ts?: number | undefined;
            project?: string | undefined;
            service_id?: number | undefined;
        }[] | undefined;
        meta?: {
            has_next?: boolean | undefined;
            next_id?: number | undefined;
        } | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'GET/v1/depconf/config/get_cids': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        env: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        cids?: unknown[] | undefined;
        success: boolean;
    }>;
    'GET/v1/depconf/config/get_generated': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        env: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configurations?: {
            commit_id?: number | undefined;
            env?: string | undefined;
            comment?: string | undefined;
            data?: string | undefined;
            service_meta_type?: string | undefined;
            created_by?: string | undefined;
            created_ts?: number | undefined;
            deleted_at?: number | undefined;
            extra_data?: {} | undefined;
            project?: string | undefined;
            id?: number | undefined;
            service_id?: number | undefined;
            modified_by?: string | undefined;
            modified_ts?: number | undefined;
        }[] | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'GET/v1/depconf/config/get_info': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        env: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configurations?: {
            comment?: string | undefined;
            created_by?: string | undefined;
            commit_id?: number | undefined;
            service_meta_type?: string | undefined;
            created_ts?: number | undefined;
            extra_data?: {} | undefined;
            deleted_at?: number | undefined;
            data?: string | undefined;
            env?: string | undefined;
            project?: string | undefined;
            modified_by?: string | undefined;
            modified_ts?: number | undefined;
            service_id?: number | undefined;
            id?: number | undefined;
        }[] | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'GET/v1/depconf/config/get_minimum_instance': (req?: {
        project?: string | undefined;
        env: string;
        cid: string;
        az: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
        value?: number | undefined;
    }>;
    'GET/v1/depconf/config/list_deployment_zone': (req?: {
        project?: string | undefined;
        service_id?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
        zones?: {
            full_name?: string | undefined;
            envs?: unknown[] | undefined;
            id?: number | undefined;
            name?: string | undefined;
            namespace?: string | undefined;
            zone_type?: string | undefined;
            zone_val?: number | undefined;
        }[] | undefined;
    }>;
    'POST/v1/depconf/config/update_idc': (req?: {
        cid: string;
        comment?: string | undefined;
        env: string;
        idcs: unknown[];
        operation?: string | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/config/update_instance': (req?: {
        project: string;
        env: string;
        cid: string;
        idc?: string | undefined;
        count: string;
        comment?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/config/update_instances': (req?: {
        comment?: string | undefined;
        email?: string | undefined;
        env: string;
        project?: string | undefined;
        requests?: {
            cid: string;
            count: number;
            idc: string;
        }[] | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/config/update_orchestrator': (req?: {
        cid?: string | undefined;
        email?: string | undefined;
        env?: string | undefined;
        idcs?: unknown[] | undefined;
        orchestrator?: string | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/config/update_overcommits': (req?: {
        comment?: string | undefined;
        email?: string | undefined;
        env: string;
        project?: string | undefined;
        requests?: {
            idc: string;
            cid: string;
            overcommit_factor: number;
            usage_class?: string | undefined;
            overcommit_policy: string;
        }[] | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'POST/v1/depconf/config/update_resource': (req?: {
        comment?: string | undefined;
        cpu: number;
        env: string;
        mem: number;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{}>;
    'GET/v1/depconf/deploymentzone/list': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        success: boolean;
        zones?: {
            envs?: unknown[] | undefined;
            full_name?: string | undefined;
            id?: number | undefined;
            name?: string | undefined;
            zone_type?: string | undefined;
            namespace?: string | undefined;
            zone_val?: number | undefined;
        }[] | undefined;
    }>;
    'GET/v1/depconf/hierarchy_config/get_all': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            deleted_ts?: number | undefined;
            deployment_zone?: string | undefined;
            az_v2?: string | undefined;
            az?: string | undefined;
            id?: number | undefined;
            key_id?: number | undefined;
            comment?: string | undefined;
            cid?: string | undefined;
            created_by?: string | undefined;
            data?: {
                canary_instances?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    enable_canary?: boolean | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            enable_canary_replacement?: boolean | undefined;
                            instances_per_agent?: number | undefined;
                            max_unavailable?: string | undefined;
                            reserve_resources?: boolean | undefined;
                            disable_restart?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            max_surge?: string | undefined;
                            in_place?: boolean | undefined;
                            threshold?: number | undefined;
                            step_down?: number | undefined;
                            strict_in_place?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                }[] | undefined;
                resources?: {
                    cpu?: number | undefined;
                    disk?: number | undefined;
                    mem?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        disable_restart?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        threshold?: number | undefined;
                        canary_stages?: unknown[] | undefined;
                        max_surge?: string | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        in_place?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        reserve_resources?: boolean | undefined;
                        step_down?: number | undefined;
                        strict_in_place?: boolean | undefined;
                    } | undefined;
                } | undefined;
                annotations?: {} | undefined;
                instances?: number | undefined;
                canary_percent?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                minimum_instances?: number | undefined;
                scheduler?: {
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            selectors?: {
                                key?: string | undefined;
                                operator?: string | undefined;
                                value?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                            max_instances?: number | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
            } | undefined;
            created_ts?: number | undefined;
            enabled?: boolean | undefined;
            env?: string | undefined;
            dz_id?: number | undefined;
            dz_type?: string | undefined;
            key_type?: string | undefined;
            level?: number | undefined;
            middleware_data?: {
                users?: string | undefined;
                acl?: string | undefined;
                dr_cluster?: string | undefined;
                alias?: string | undefined;
                dr_data_sync_method?: string | undefined;
                dr_enable?: boolean | undefined;
                password?: string | undefined;
            } | undefined;
            path_names?: unknown[] | undefined;
            project?: string | undefined;
            service_meta_type?: string | undefined;
            updated_ts?: number | undefined;
            version?: number | undefined;
            service_id?: number | undefined;
            path?: string | undefined;
        }[] | undefined;
        meta?: {
            has_next?: boolean | undefined;
            next_id?: number | undefined;
        } | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'GET/v1/depconf/hierarchy_config/get_generated': (req?: {
        project: string;
        service_id: string;
        dz_type: string;
        env: string;
        cid: string;
        cid_group: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            az?: string | undefined;
            az_v2?: string | undefined;
            cid?: string | undefined;
            data?: {
                scheduler?: {
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            selectors?: {
                                key?: string | undefined;
                                value?: string | undefined;
                                operator?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                            max_instances?: number | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        strict_in_place?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        canary_stages?: unknown[] | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        instances_per_agent?: number | undefined;
                        in_place?: boolean | undefined;
                        max_surge?: string | undefined;
                        step_down?: number | undefined;
                        reserve_resources?: boolean | undefined;
                        threshold?: number | undefined;
                    } | undefined;
                } | undefined;
                annotations?: {} | undefined;
                canary_instances?: number | undefined;
                canary_percent?: number | undefined;
                instances?: number | undefined;
                minimum_instances?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                ecp_cluster_configs?: {
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            canary_stages?: unknown[] | undefined;
                            instances_per_agent?: number | undefined;
                            in_place?: boolean | undefined;
                            disable_restart?: boolean | undefined;
                            enable_canary_replacement?: boolean | undefined;
                            reserve_resources?: boolean | undefined;
                            max_surge?: string | undefined;
                            max_unavailable?: string | undefined;
                            step_down?: number | undefined;
                            strict_in_place?: boolean | undefined;
                            threshold?: number | undefined;
                        } | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    canary_init_count?: number | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                    enable_canary?: boolean | undefined;
                }[] | undefined;
                resources?: {
                    cpu?: number | undefined;
                    disk?: number | undefined;
                    gpu?: number | undefined;
                    mem?: number | undefined;
                } | undefined;
            } | undefined;
            deployment_zone_enum?: number | undefined;
            deployment_zone_name?: string | undefined;
            env?: string | undefined;
            deployment_zone_type?: string | undefined;
        }[] | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        success: boolean;
    }>;
    'GET/v1/depconf/hierarchy_config/get_info': (req?: {
        project: string;
        service_id: string;
        dz_type: string;
        level?: string | undefined;
        path?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            az?: string | undefined;
            dz_type?: string | undefined;
            enabled?: boolean | undefined;
            cid?: string | undefined;
            az_v2?: string | undefined;
            env?: string | undefined;
            comment?: string | undefined;
            created_by?: string | undefined;
            middleware_data?: {
                acl?: string | undefined;
                alias?: string | undefined;
                dr_enable?: boolean | undefined;
                dr_cluster?: string | undefined;
                dr_data_sync_method?: string | undefined;
                password?: string | undefined;
                users?: string | undefined;
            } | undefined;
            created_ts?: number | undefined;
            dz_id?: number | undefined;
            data?: {
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                minimum_instances?: number | undefined;
                canary_percent?: number | undefined;
                annotations?: {} | undefined;
                canary_instances?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    cluster?: string | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    enable_canary?: boolean | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            enable_canary_replacement?: boolean | undefined;
                            threshold?: number | undefined;
                            disable_restart?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            max_surge?: string | undefined;
                            strict_in_place?: boolean | undefined;
                            reserve_resources?: boolean | undefined;
                            step_down?: number | undefined;
                            max_unavailable?: string | undefined;
                            instances_per_agent?: number | undefined;
                            in_place?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                }[] | undefined;
                instances?: number | undefined;
                resources?: {
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    mem?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
                scheduler?: {
                    orchestrator?: string | undefined;
                    assignment_policies?: {
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                value?: string | undefined;
                                key?: string | undefined;
                                operator?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                        name?: string | undefined;
                    }[] | undefined;
                } | undefined;
                strategy?: {
                    parameters?: {
                        canary_stages?: unknown[] | undefined;
                        step_down?: number | undefined;
                        strict_in_place?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        threshold?: number | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        reserve_resources?: boolean | undefined;
                        max_surge?: string | undefined;
                        max_unavailable?: string | undefined;
                    } | undefined;
                    name?: string | undefined;
                } | undefined;
            } | undefined;
            deleted_ts?: number | undefined;
            deployment_zone?: string | undefined;
            service_id?: number | undefined;
            id?: number | undefined;
            version?: number | undefined;
            key_type?: string | undefined;
            key_id?: number | undefined;
            level?: number | undefined;
            path?: string | undefined;
            path_names?: unknown[] | undefined;
            updated_ts?: number | undefined;
            project?: string | undefined;
            service_meta_type?: string | undefined;
        }[] | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'POST/v1/depconf/hierarchy_config_commit/create': (req?: {
        comment?: string | undefined;
        payloads?: {
            env?: string | undefined;
            az?: string | undefined;
            level: number;
            config: {
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            enable_canary_replacement?: boolean | undefined;
                            in_place?: boolean | undefined;
                            strict_in_place?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            instances_per_agent?: number | undefined;
                            reserve_resources?: boolean | undefined;
                            max_surge?: string | undefined;
                            max_unavailable?: string | undefined;
                            step_down?: number | undefined;
                            threshold?: number | undefined;
                        } | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                    enable_canary?: boolean | undefined;
                }[] | undefined;
                minimum_instances?: number | undefined;
                annotations?: {} | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        canary_stages?: unknown[] | undefined;
                        disable_restart?: boolean | undefined;
                        reserve_resources?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        max_surge?: string | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        strict_in_place?: boolean | undefined;
                        threshold?: number | undefined;
                        step_down?: number | undefined;
                        max_unavailable?: string | undefined;
                    } | undefined;
                } | undefined;
                canary_instances?: number | undefined;
                canary_percent?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                resources?: {
                    mem?: number | undefined;
                    cpu?: number | undefined;
                    disk?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
                instances?: number | undefined;
                scheduler?: {
                    orchestrator?: string | undefined;
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                value?: string | undefined;
                                key?: string | undefined;
                                operator?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                } | undefined;
            };
            cid?: string | undefined;
            az_v2?: string | undefined;
            deployment_zone?: string | undefined;
            dz_type: string;
            version?: number | undefined;
        }[] | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits?: {
            comment?: string | undefined;
            created_ts?: number | undefined;
            data?: {
                annotations?: {} | undefined;
                canary_instances?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    enable_canary?: boolean | undefined;
                    cluster?: string | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            max_unavailable?: string | undefined;
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            instances_per_agent?: number | undefined;
                            in_place?: boolean | undefined;
                            step_down?: number | undefined;
                            max_surge?: string | undefined;
                            reserve_resources?: boolean | undefined;
                            strict_in_place?: boolean | undefined;
                            threshold?: number | undefined;
                            enable_canary_replacement?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                }[] | undefined;
                scheduler?: {
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                operator?: string | undefined;
                                key?: string | undefined;
                                values?: unknown[] | undefined;
                                value?: string | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        canary_stages?: unknown[] | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        max_surge?: string | undefined;
                        reserve_resources?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        step_down?: number | undefined;
                        strict_in_place?: boolean | undefined;
                        threshold?: number | undefined;
                    } | undefined;
                } | undefined;
                canary_percent?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                resources?: {
                    cpu?: number | undefined;
                    disk?: number | undefined;
                    mem?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
                minimum_instances?: number | undefined;
                instances?: number | undefined;
            } | undefined;
            az?: string | undefined;
            created_by?: string | undefined;
            az_v2?: string | undefined;
            cid?: string | undefined;
            path?: string | undefined;
            dz_type?: string | undefined;
            enabled?: boolean | undefined;
            id?: number | undefined;
            level?: number | undefined;
            middleware_data?: {
                password?: string | undefined;
                acl?: string | undefined;
                alias?: string | undefined;
                dr_enable?: boolean | undefined;
                dr_cluster?: string | undefined;
                dr_data_sync_method?: string | undefined;
                users?: string | undefined;
            } | undefined;
            service_meta_type?: string | undefined;
            project?: string | undefined;
            version?: number | undefined;
            env?: string | undefined;
            key_type?: string | undefined;
            key_id?: number | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'GET/v1/depconf/hierarchy_config_commit/get_info': (req?: {
        project: string;
        service_id: string;
        dz_type: string;
        level?: string | undefined;
        next_id?: number | undefined;
        limit?: number | undefined;
        get_children?: boolean | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits?: {
            az?: string | undefined;
            dz_type?: string | undefined;
            cid?: string | undefined;
            data?: {
                minimum_instances?: number | undefined;
                annotations?: {} | undefined;
                canary_instances?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    enable_canary?: boolean | undefined;
                    replicas?: number | undefined;
                    strategy_definition?: {
                        parameters?: {
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            strict_in_place?: boolean | undefined;
                            reserve_resources?: boolean | undefined;
                            in_place?: boolean | undefined;
                            enable_canary_replacement?: boolean | undefined;
                            step_down?: number | undefined;
                            max_unavailable?: string | undefined;
                            threshold?: number | undefined;
                            instances_per_agent?: number | undefined;
                            max_surge?: string | undefined;
                        } | undefined;
                        name?: string | undefined;
                    } | undefined;
                }[] | undefined;
                canary_percent?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                instances?: number | undefined;
                resources?: {
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    gpu?: number | undefined;
                    mem?: number | undefined;
                } | undefined;
                scheduler?: {
                    orchestrator?: string | undefined;
                    assignment_policies?: {
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                values?: unknown[] | undefined;
                                key?: string | undefined;
                                operator?: string | undefined;
                                value?: string | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                        name?: string | undefined;
                    }[] | undefined;
                } | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        max_surge?: string | undefined;
                        canary_stages?: unknown[] | undefined;
                        instances_per_agent?: number | undefined;
                        in_place?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        step_down?: number | undefined;
                        strict_in_place?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        reserve_resources?: boolean | undefined;
                        threshold?: number | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            comment?: string | undefined;
            created_by?: string | undefined;
            created_ts?: number | undefined;
            enabled?: boolean | undefined;
            key_id?: number | undefined;
            id?: number | undefined;
            env?: string | undefined;
            level?: number | undefined;
            project?: string | undefined;
            key_type?: string | undefined;
            middleware_data?: {
                password?: string | undefined;
                dr_cluster?: string | undefined;
                acl?: string | undefined;
                alias?: string | undefined;
                dr_data_sync_method?: string | undefined;
                dr_enable?: boolean | undefined;
                users?: string | undefined;
            } | undefined;
            path?: string | undefined;
            az_v2?: string | undefined;
            service_meta_type?: string | undefined;
            version?: number | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'GET/v1/depconf/meta/get_orchestrators': (req?: {
        service_name?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        not_active?: {
            env: string;
            idc: string;
        }[] | undefined;
        orchestrators?: {} | undefined;
    }>;
    'GET/v1/depconf/meta/get_service_metadata': (req?: {
        service_name: string;
        service_id: number;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        show_dz_ui?: boolean | undefined;
    }>;
    'GET/v2/app_model/hierarchy_config/get_all': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            data?: {
                annotations?: {} | undefined;
                canary_percent?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            enable_canary_replacement?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            instances_per_agent?: number | undefined;
                            in_place?: boolean | undefined;
                            max_surge?: string | undefined;
                            max_unavailable?: string | undefined;
                            reserve_resources?: boolean | undefined;
                            strict_in_place?: boolean | undefined;
                            step_down?: number | undefined;
                            threshold?: number | undefined;
                        } | undefined;
                    } | undefined;
                    enable_canary?: boolean | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    replicas?: number | undefined;
                }[] | undefined;
                canary_instances?: number | undefined;
                instances?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                scheduler?: {
                    orchestrator?: string | undefined;
                    assignment_policies?: {
                        parameters?: {
                            max_instances?: number | undefined;
                            unique_key?: string | undefined;
                            selectors?: {
                                operator?: string | undefined;
                                key?: string | undefined;
                                value?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                        } | undefined;
                        name?: string | undefined;
                    }[] | undefined;
                } | undefined;
                minimum_instances?: number | undefined;
                resources?: {
                    gpu?: number | undefined;
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    mem?: number | undefined;
                } | undefined;
                strategy?: {
                    parameters?: {
                        canary_stages?: unknown[] | undefined;
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        strict_in_place?: boolean | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        max_surge?: string | undefined;
                        reserve_resources?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        step_down?: number | undefined;
                        threshold?: number | undefined;
                    } | undefined;
                    name?: string | undefined;
                } | undefined;
            } | undefined;
            dz_id?: number | undefined;
            az?: string | undefined;
            az_v2?: string | undefined;
            created_by?: string | undefined;
            key_id?: number | undefined;
            cid?: string | undefined;
            level?: number | undefined;
            comment?: string | undefined;
            created_ts?: number | undefined;
            deleted_ts?: number | undefined;
            dz_type?: string | undefined;
            deployment_zone?: string | undefined;
            service_meta_type?: string | undefined;
            enabled?: boolean | undefined;
            id?: number | undefined;
            env?: string | undefined;
            key_type?: string | undefined;
            path?: string | undefined;
            middleware_data?: {
                dr_cluster?: string | undefined;
                acl?: string | undefined;
                alias?: string | undefined;
                password?: string | undefined;
                dr_data_sync_method?: string | undefined;
                dr_enable?: boolean | undefined;
                users?: string | undefined;
            } | undefined;
            project?: string | undefined;
            path_names?: unknown[] | undefined;
            updated_ts?: number | undefined;
            service_id?: number | undefined;
            version?: number | undefined;
        }[] | undefined;
        meta?: {
            has_next?: boolean | undefined;
            next_id?: number | undefined;
        } | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'GET/v2/app_model/hierarchy_config/get_info': (req?: {
        project: string;
        service_id: string;
        service_meta_type: string;
        dz_type: string;
        level?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        configs?: {
            az_v2?: string | undefined;
            cid?: string | undefined;
            az?: string | undefined;
            env?: string | undefined;
            comment?: string | undefined;
            created_by?: string | undefined;
            path?: string | undefined;
            created_ts?: number | undefined;
            data?: {
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    enable_canary?: boolean | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            enable_canary_replacement?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            max_surge?: string | undefined;
                            in_place?: boolean | undefined;
                            instances_per_agent?: number | undefined;
                            max_unavailable?: string | undefined;
                            reserve_resources?: boolean | undefined;
                            step_down?: number | undefined;
                            strict_in_place?: boolean | undefined;
                            threshold?: number | undefined;
                        } | undefined;
                    } | undefined;
                    cluster?: string | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                }[] | undefined;
                scheduler?: {
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                key?: string | undefined;
                                values?: unknown[] | undefined;
                                operator?: string | undefined;
                                value?: string | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
                canary_percent?: number | undefined;
                annotations?: {} | undefined;
                canary_instances?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                instances?: number | undefined;
                minimum_instances?: number | undefined;
                resources?: {
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    gpu?: number | undefined;
                    mem?: number | undefined;
                } | undefined;
                strategy?: {
                    parameters?: {
                        max_unavailable?: string | undefined;
                        canary_stages?: unknown[] | undefined;
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        max_surge?: string | undefined;
                        strict_in_place?: boolean | undefined;
                        reserve_resources?: boolean | undefined;
                        threshold?: number | undefined;
                        step_down?: number | undefined;
                    } | undefined;
                    name?: string | undefined;
                } | undefined;
            } | undefined;
            deleted_ts?: number | undefined;
            dz_id?: number | undefined;
            dz_type?: string | undefined;
            id?: number | undefined;
            key_id?: number | undefined;
            enabled?: boolean | undefined;
            key_type?: string | undefined;
            level?: number | undefined;
            path_names?: unknown[] | undefined;
            service_id?: number | undefined;
            project?: string | undefined;
            service_meta_type?: string | undefined;
            updated_ts?: number | undefined;
            version?: number | undefined;
            middleware_data?: {
                alias?: string | undefined;
                dr_cluster?: string | undefined;
                dr_data_sync_method?: string | undefined;
                dr_enable?: boolean | undefined;
                password?: string | undefined;
                users?: string | undefined;
                acl?: string | undefined;
            } | undefined;
            deployment_zone?: string | undefined;
        }[] | undefined;
        success: boolean;
        total_count?: number | undefined;
    }>;
    'POST/v2/app_model/hierarchy_config_commit/create': (req?: {
        az?: string | undefined;
        az_v2?: string | undefined;
        cid?: string | undefined;
        comment?: string | undefined;
        config?: {
            annotations?: {} | undefined;
            component_detail?: {
                workload_type?: string | undefined;
            } | undefined;
            canary_instances?: number | undefined;
            canary_percent?: number | undefined;
            ecp_cluster_configs?: {
                strategy_definition?: {
                    name?: string | undefined;
                    parameters?: {
                        reserve_resources?: boolean | undefined;
                        canary_stages?: unknown[] | undefined;
                        strict_in_place?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        max_surge?: string | undefined;
                        max_unavailable?: string | undefined;
                        step_down?: number | undefined;
                        threshold?: number | undefined;
                    } | undefined;
                } | undefined;
                canary_init_count?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                cluster?: string | undefined;
                enable_canary?: boolean | undefined;
                replicas?: number | undefined;
            }[] | undefined;
            instances?: number | undefined;
            minimum_instances?: number | undefined;
            resources?: {
                disk?: number | undefined;
                cpu?: number | undefined;
                mem?: number | undefined;
                gpu?: number | undefined;
            } | undefined;
            scheduler?: {
                assignment_policies?: {
                    name?: string | undefined;
                    parameters?: {
                        selectors?: {
                            value?: string | undefined;
                            key?: string | undefined;
                            values?: unknown[] | undefined;
                            operator?: string | undefined;
                        }[] | undefined;
                        max_instances?: number | undefined;
                        unique_key?: string | undefined;
                    } | undefined;
                }[] | undefined;
                orchestrator?: string | undefined;
            } | undefined;
            strategy?: {
                parameters?: {
                    canary_stages?: unknown[] | undefined;
                    enable_canary_replacement?: boolean | undefined;
                    instances_per_agent?: number | undefined;
                    disable_restart?: boolean | undefined;
                    in_place?: boolean | undefined;
                    step_down?: number | undefined;
                    max_surge?: string | undefined;
                    reserve_resources?: boolean | undefined;
                    max_unavailable?: string | undefined;
                    strict_in_place?: boolean | undefined;
                    threshold?: number | undefined;
                } | undefined;
                name?: string | undefined;
            } | undefined;
        } | undefined;
        deployment_zone?: string | undefined;
        dz_type: string;
        env?: string | undefined;
        level?: number | undefined;
        middleware_config?: {
            dr_cluster?: string | undefined;
            dr_data_sync_method?: string | undefined;
            acl?: string | undefined;
            dr_enable?: boolean | undefined;
            alias?: string | undefined;
            users?: string | undefined;
            password?: string | undefined;
        } | undefined;
        project?: string | undefined;
        service_id?: number | undefined;
        service_meta_type?: string | undefined;
        version?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits?: {
            comment?: string | undefined;
            az?: string | undefined;
            az_v2?: string | undefined;
            data?: {
                annotations?: {} | undefined;
                canary_percent?: number | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                canary_instances?: number | undefined;
                minimum_instances?: number | undefined;
                ecp_cluster_configs?: {
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    canary_init_count?: number | undefined;
                    replicas?: number | undefined;
                    cluster?: string | undefined;
                    enable_canary?: boolean | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            instances_per_agent?: number | undefined;
                            reserve_resources?: boolean | undefined;
                            enable_canary_replacement?: boolean | undefined;
                            step_down?: number | undefined;
                            canary_stages?: unknown[] | undefined;
                            disable_restart?: boolean | undefined;
                            in_place?: boolean | undefined;
                            max_surge?: string | undefined;
                            threshold?: number | undefined;
                            max_unavailable?: string | undefined;
                            strict_in_place?: boolean | undefined;
                        } | undefined;
                    } | undefined;
                }[] | undefined;
                instances?: number | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        max_unavailable?: string | undefined;
                        step_down?: number | undefined;
                        canary_stages?: unknown[] | undefined;
                        threshold?: number | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        disable_restart?: boolean | undefined;
                        max_surge?: string | undefined;
                        in_place?: boolean | undefined;
                        instances_per_agent?: number | undefined;
                        reserve_resources?: boolean | undefined;
                        strict_in_place?: boolean | undefined;
                    } | undefined;
                } | undefined;
                resources?: {
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    mem?: number | undefined;
                    gpu?: number | undefined;
                } | undefined;
                scheduler?: {
                    assignment_policies?: {
                        parameters?: {
                            max_instances?: number | undefined;
                            selectors?: {
                                operator?: string | undefined;
                                key?: string | undefined;
                                values?: unknown[] | undefined;
                                value?: string | undefined;
                            }[] | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                        name?: string | undefined;
                    }[] | undefined;
                    orchestrator?: string | undefined;
                } | undefined;
            } | undefined;
            enabled?: boolean | undefined;
            cid?: string | undefined;
            created_by?: string | undefined;
            dz_type?: string | undefined;
            created_ts?: number | undefined;
            env?: string | undefined;
            id?: number | undefined;
            key_id?: number | undefined;
            key_type?: string | undefined;
            path?: string | undefined;
            level?: number | undefined;
            middleware_data?: {
                alias?: string | undefined;
                acl?: string | undefined;
                dr_data_sync_method?: string | undefined;
                dr_cluster?: string | undefined;
                password?: string | undefined;
                dr_enable?: boolean | undefined;
                users?: string | undefined;
            } | undefined;
            service_meta_type?: string | undefined;
            project?: string | undefined;
            version?: number | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'GET/v2/app_model/hierarchy_config_commit/get_info': (req?: {
        project: string;
        service_id: string;
        service_meta_type: string;
        dz_type: string;
        level?: string | undefined;
        next_id?: number | undefined;
        limit?: number | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        commits?: {
            comment?: string | undefined;
            env?: string | undefined;
            az_v2?: string | undefined;
            az?: string | undefined;
            created_by?: string | undefined;
            level?: number | undefined;
            path?: string | undefined;
            created_ts?: number | undefined;
            data?: {
                annotations?: {} | undefined;
                component_detail?: {
                    workload_type?: string | undefined;
                } | undefined;
                canary_instances?: number | undefined;
                canary_percent?: number | undefined;
                ecp_cluster_configs?: {
                    canary_init_count?: number | undefined;
                    cluster?: string | undefined;
                    component_detail?: {
                        workload_type?: string | undefined;
                    } | undefined;
                    strategy_definition?: {
                        name?: string | undefined;
                        parameters?: {
                            max_unavailable?: string | undefined;
                            disable_restart?: boolean | undefined;
                            in_place?: boolean | undefined;
                            enable_canary_replacement?: boolean | undefined;
                            canary_stages?: unknown[] | undefined;
                            instances_per_agent?: number | undefined;
                            max_surge?: string | undefined;
                            reserve_resources?: boolean | undefined;
                            strict_in_place?: boolean | undefined;
                            threshold?: number | undefined;
                            step_down?: number | undefined;
                        } | undefined;
                    } | undefined;
                    replicas?: number | undefined;
                    enable_canary?: boolean | undefined;
                }[] | undefined;
                instances?: number | undefined;
                resources?: {
                    gpu?: number | undefined;
                    disk?: number | undefined;
                    cpu?: number | undefined;
                    mem?: number | undefined;
                } | undefined;
                minimum_instances?: number | undefined;
                scheduler?: {
                    orchestrator?: string | undefined;
                    assignment_policies?: {
                        name?: string | undefined;
                        parameters?: {
                            selectors?: {
                                key?: string | undefined;
                                value?: string | undefined;
                                operator?: string | undefined;
                                values?: unknown[] | undefined;
                            }[] | undefined;
                            max_instances?: number | undefined;
                            unique_key?: string | undefined;
                        } | undefined;
                    }[] | undefined;
                } | undefined;
                strategy?: {
                    name?: string | undefined;
                    parameters?: {
                        in_place?: boolean | undefined;
                        threshold?: number | undefined;
                        canary_stages?: unknown[] | undefined;
                        instances_per_agent?: number | undefined;
                        disable_restart?: boolean | undefined;
                        enable_canary_replacement?: boolean | undefined;
                        max_unavailable?: string | undefined;
                        reserve_resources?: boolean | undefined;
                        max_surge?: string | undefined;
                        step_down?: number | undefined;
                        strict_in_place?: boolean | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            dz_type?: string | undefined;
            enabled?: boolean | undefined;
            key_type?: string | undefined;
            middleware_data?: {
                alias?: string | undefined;
                dr_data_sync_method?: string | undefined;
                password?: string | undefined;
                acl?: string | undefined;
                users?: string | undefined;
                dr_cluster?: string | undefined;
                dr_enable?: boolean | undefined;
            } | undefined;
            key_id?: number | undefined;
            id?: number | undefined;
            service_meta_type?: string | undefined;
            project?: string | undefined;
            version?: number | undefined;
            cid?: string | undefined;
        }[] | undefined;
        success: boolean;
    }>;
    'GET/v2/app_model/meta/get_service_meta_types': (req?: {
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        types?: {
            name?: string | undefined;
            service_meta_type?: string | undefined;
        }[] | undefined;
    }>;
    'GET/apis/autoscaler/v1/service/acknowledgement_status': (req?: {
        project: string;
        module: string;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        error_code: number;
        error_message: string;
        toggle_state: number;
    }>;
    'GET/apis/cmdb/v2/service/get_unbounded_sdus': (req?: {
        resource_type?: string | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        sdu: {
            sdu: string;
            resource_type: string;
            env: string;
            cid: string;
            idcs: unknown[];
            version: string;
            deployment_link: string;
            label: {};
            created_at: number;
            updated_at: number;
        }[];
        total_size: number;
    }>;
    'POST/apis/cmdb/v2/service/bind_sdu': (req?: {
        service_name: string;
        resource_type: string;
        sdu: string;
        force?: boolean | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        bounded: {
            service: {
                service_id: number;
                service_name: string;
                data: {
                    spexible: string;
                };
                updated_by: string;
                service_owners: unknown[];
                enabled: boolean;
                created_at: number;
                updated_at: number;
            };
            sdu: {
                sdu: string;
                sdu_type: string;
                env: string;
                cid: string;
                idcs: string[];
                version: string;
                deployment_link: string;
                label: {};
                created_at: number;
                updated_at: number;
            };
            bind: {
                service_sdu_relation_id: number;
                service_id: number;
                sdu_id: number;
                enabled: boolean;
                created_at: number;
                updated_at: number;
            };
        }[];
    }>;
    'POST/apis/cmdb/v2/service/unbind_sdu': (req?: {
        service_name: string;
        resource_type: string;
        sdu: string;
        force?: boolean | undefined;
        __scene?: string | undefined;
    } | undefined, extra?: commonLib.IExtra | undefined) => Promise<{
        unbounded: {
            service: {
                service_id: number;
                service_name: string;
                data: {
                    spexible: string;
                };
                updated_by: string;
                service_owners: unknown[];
                enabled: boolean;
                created_at: number;
                updated_at: number;
            };
            sdu: {
                sdu: string;
                resource_type: string;
                env: string;
                cid: string;
                idcs: string[];
                version: string;
                deployment_link: string;
                label: {};
                created_at: number;
                updated_at: number;
            };
            unbind: {
                service_sdu_relation_id: number;
                service_id: number;
                sdu_id: number;
                enabled: boolean;
                created_at: number;
                updated_at: number;
            };
        }[];
    }>;
};
export {};

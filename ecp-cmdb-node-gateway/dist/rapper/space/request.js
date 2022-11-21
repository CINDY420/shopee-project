"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetch = void 0;
const commonLib = __importStar(require("@infra/rapper/runtime/commonLib"));
const extra_1 = require("./extra");
function createFetch(fetchConfig, extraConfig) {
    if (!extraConfig || !extraConfig.fetchType) {
        console.warn('Rapper Warning: createFetch API will be deprecated, if you want to customize fetch, please use overrideFetch instead, since new API guarantees better type consistency during frontend lifespan. See detail https://www.yuque.com/rap/rapper/overridefetch');
    }
    const rapperFetch = commonLib.getRapperRequest(fetchConfig);
    function fetchMethod(name) {
        const idx = name.indexOf('/');
        const method = name.substring(0, idx);
        const url = name.substring(idx);
        return (req, extra) => {
            extra = extra || {};
            extra.reqType = Object.assign(Object.assign({}, (extra.reqType || {})), extra_1.IReqType[name]);
            return rapperFetch({
                url,
                method,
                params: req,
                extra,
            });
        };
    }
    return {
        'POST/v1/depconf/binding/bind_service': fetchMethod('POST/v1/depconf/binding/bind_service'),
        'GET/v1/depconf/binding/list': fetchMethod('GET/v1/depconf/binding/list'),
        'POST/v1/depconf/binding/unbind_service': fetchMethod('POST/v1/depconf/binding/unbind_service'),
        'POST/v1/depconf/commit/copy_to': fetchMethod('POST/v1/depconf/commit/copy_to'),
        'POST/v1/depconf/commit/create': fetchMethod('POST/v1/depconf/commit/create'),
        'GET/v1/depconf/commit/get_info': fetchMethod('GET/v1/depconf/commit/get_info'),
        'GET/v1/depconf/commit/get_latest_changes': fetchMethod('GET/v1/depconf/commit/get_latest_changes'),
        'POST/v1/depconf/config/add_deployment_zone': fetchMethod('POST/v1/depconf/config/add_deployment_zone'),
        'POST/v1/depconf/config/bulk_get_field': fetchMethod('POST/v1/depconf/config/bulk_get_field'),
        'POST/v1/depconf/config/delete': fetchMethod('POST/v1/depconf/config/delete'),
        'POST/v1/depconf/config/delete_deployment_zone': fetchMethod('POST/v1/depconf/config/delete_deployment_zone'),
        'GET/v1/depconf/config/get_all': fetchMethod('GET/v1/depconf/config/get_all'),
        'GET/v1/depconf/config/get_cids': fetchMethod('GET/v1/depconf/config/get_cids'),
        'GET/v1/depconf/config/get_generated': fetchMethod('GET/v1/depconf/config/get_generated'),
        'GET/v1/depconf/config/get_info': fetchMethod('GET/v1/depconf/config/get_info'),
        'GET/v1/depconf/config/get_minimum_instance': fetchMethod('GET/v1/depconf/config/get_minimum_instance'),
        'GET/v1/depconf/config/list_deployment_zone': fetchMethod('GET/v1/depconf/config/list_deployment_zone'),
        'POST/v1/depconf/config/update_idc': fetchMethod('POST/v1/depconf/config/update_idc'),
        'POST/v1/depconf/config/update_instance': fetchMethod('POST/v1/depconf/config/update_instance'),
        'POST/v1/depconf/config/update_instances': fetchMethod('POST/v1/depconf/config/update_instances'),
        'POST/v1/depconf/config/update_orchestrator': fetchMethod('POST/v1/depconf/config/update_orchestrator'),
        'POST/v1/depconf/config/update_overcommits': fetchMethod('POST/v1/depconf/config/update_overcommits'),
        'POST/v1/depconf/config/update_resource': fetchMethod('POST/v1/depconf/config/update_resource'),
        'GET/v1/depconf/deploymentzone/list': fetchMethod('GET/v1/depconf/deploymentzone/list'),
        'GET/v1/depconf/hierarchy_config/get_all': fetchMethod('GET/v1/depconf/hierarchy_config/get_all'),
        'GET/v1/depconf/hierarchy_config/get_generated': fetchMethod('GET/v1/depconf/hierarchy_config/get_generated'),
        'GET/v1/depconf/hierarchy_config/get_info': fetchMethod('GET/v1/depconf/hierarchy_config/get_info'),
        'POST/v1/depconf/hierarchy_config_commit/create': fetchMethod('POST/v1/depconf/hierarchy_config_commit/create'),
        'GET/v1/depconf/hierarchy_config_commit/get_info': fetchMethod('GET/v1/depconf/hierarchy_config_commit/get_info'),
        'GET/v1/depconf/meta/get_orchestrators': fetchMethod('GET/v1/depconf/meta/get_orchestrators'),
        'GET/v1/depconf/meta/get_service_metadata': fetchMethod('GET/v1/depconf/meta/get_service_metadata'),
        'GET/v2/app_model/hierarchy_config/get_all': fetchMethod('GET/v2/app_model/hierarchy_config/get_all'),
        'GET/v2/app_model/hierarchy_config/get_info': fetchMethod('GET/v2/app_model/hierarchy_config/get_info'),
        'POST/v2/app_model/hierarchy_config_commit/create': fetchMethod('POST/v2/app_model/hierarchy_config_commit/create'),
        'GET/v2/app_model/hierarchy_config_commit/get_info': fetchMethod('GET/v2/app_model/hierarchy_config_commit/get_info'),
        'GET/v2/app_model/meta/get_service_meta_types': fetchMethod('GET/v2/app_model/meta/get_service_meta_types'),
        'GET/apis/autoscaler/v1/service/acknowledgement_status': fetchMethod('GET/apis/autoscaler/v1/service/acknowledgement_status'),
        'GET/apis/cmdb/v2/service/get_unbounded_sdus': fetchMethod('GET/apis/cmdb/v2/service/get_unbounded_sdus'),
        'POST/apis/cmdb/v2/service/bind_sdu': fetchMethod('POST/apis/cmdb/v2/service/bind_sdu'),
        'POST/apis/cmdb/v2/service/unbind_sdu': fetchMethod('POST/apis/cmdb/v2/service/unbind_sdu'),
    };
}
exports.createFetch = createFetch;
//# sourceMappingURL=request.js.map
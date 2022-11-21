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
        'GET/api/v1/ping': fetchMethod('GET/api/v1/ping'),
        'GET/ecpapi/v2/az/{azKey}/mapping': fetchMethod('GET/ecpapi/v2/az/{azKey}/mapping'),
        'GET/ecpapi/v2/azs': fetchMethod('GET/ecpapi/v2/azs'),
        'GET/ecpapi/v2/check': fetchMethod('GET/ecpapi/v2/check'),
        'GET/ecpapi/v2/cluster/{uuid}/detail': fetchMethod('GET/ecpapi/v2/cluster/{uuid}/detail'),
        'POST/ecpapi/v2/clustermeta': fetchMethod('POST/ecpapi/v2/clustermeta'),
        'GET/ecpapi/v2/clusters/{clusterName}/nodes': fetchMethod('GET/ecpapi/v2/clusters/{clusterName}/nodes'),
        'POST/ecpapi/v2/sdus/{sduName}/deployments': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/deployments'),
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/svcdeploys'),
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta'),
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/result'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:rollback'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend'),
        'GET/ecpapi/v2/workloads': fetchMethod('GET/ecpapi/v2/workloads'),
        'GET/ecpapi/v2/sdus/{sduName}/hpas': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/hpas'),
        'GET/ecpapi/v2/sdus/{sduName}/summary': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/summary'),
        'GET/ecpapi/v2/services/{serviceId}/sdus': fetchMethod('GET/ecpapi/v2/services/{serviceId}/sdus'),
        'GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods': fetchMethod('GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill'),
        'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics': fetchMethod('POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics'),
    };
}
exports.createFetch = createFetch;
//# sourceMappingURL=request.js.map
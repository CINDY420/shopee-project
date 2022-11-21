"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@infra/utils");
const exception_1 = require("@infra-node-kit/exception");
const error_1 = require("../../helpers/constants/error");
const util_1 = require("util");
const list_query_dto_1 = require("../../helpers/models/list-query.dto");
const try_get_message_1 = require("../../helpers/utils/try-get-message");
const fetch_service_1 = require("../fetch/fetch.service");
let PodService = class PodService {
    constructor(fetchService) {
        this.fetchService = fetchService;
        this.formatPodMetricFn = (metric, metricType) => {
            const formatMetric = metricType === 'cpu'
                ? {
                    applied: parseFloat(metric.applied.toFixed(2)),
                    used: parseFloat(metric.used.toFixed(2)),
                }
                : {
                    applied: parseFloat((metric.applied / 1024).toFixed(2)),
                    used: parseFloat((metric.used / 1024).toFixed(2)),
                };
            return formatMetric;
        };
    }
    async listDeploymentPods(param, query) {
        var _a, _b, _c, _d;
        const { sduName, deployId } = param;
        const { filterBy, searchBy } = query;
        const [podList, podListRequestError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods']({
            sduName,
            deployId,
        }));
        if (podListRequestError) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = podListRequestError === null || podListRequestError === void 0 ? void 0 : podListRequestError.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = podListRequestError === null || podListRequestError === void 0 ? void 0 : podListRequestError.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        const { items: podItems } = podList;
        const filterList = list_query_dto_1.ListQuery.parseFilterBy(filterBy);
        const filteredByStatusPods = list_query_dto_1.ListQuery.getFilteredData(filterList, podItems);
        const searchValue = searchBy && list_query_dto_1.ListQuery.parseFilter(searchBy).value;
        const searchRegexp = searchValue && new RegExp(`.*${searchValue}.*`);
        const filteredBySearchValuePods = searchRegexp
            ? filteredByStatusPods.filter((pod) => searchRegexp.test(pod.podName) ||
                searchRegexp.test(pod.nodeIp) ||
                searchRegexp.test(pod.podIp))
            : filteredByStatusPods;
        const getPodsMetricsBody = filteredBySearchValuePods.map((item) => ({
            podName: item.podName,
            namespace: item.namespace,
        }));
        const [podsMetrics, podsMetricsRequestError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics']({
            deployId,
            sduName,
            pods: getPodsMetricsBody,
        }));
        if (podsMetricsRequestError) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_c = podsMetricsRequestError === null || podsMetricsRequestError === void 0 ? void 0 : podsMetricsRequestError.response) === null || _c === void 0 ? void 0 : _c.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_d = podsMetricsRequestError === null || podsMetricsRequestError === void 0 ? void 0 : podsMetricsRequestError.response) === null || _d === void 0 ? void 0 : _d.data,
            });
        }
        const { items: podsMetricsItems } = podsMetrics;
        const podListWithMetrics = filteredBySearchValuePods.map((pod) => {
            const podMetric = podsMetricsItems.find((item) => item.podName === pod.podName && item.namespace === pod.namespace);
            if (!podMetric) {
                const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
                (0, exception_1.throwError)({
                    status,
                    message: (0, util_1.format)(message, `${pod.podName} metric is not find`),
                });
            }
            return Object.assign(Object.assign({}, pod), { cpu: this.formatPodMetricFn(podMetric.cpu, 'cpu'), memory: this.formatPodMetricFn(podMetric.memory, 'memory') });
        });
        const statusList = podListWithMetrics.map((podItem) => podItem.status);
        const set = new Set(statusList);
        const deduplicatedStatusList = [...set];
        return {
            items: podListWithMetrics,
            statusList: deduplicatedStatusList,
            total: podListWithMetrics.length,
        };
    }
    async killPod(param, body) {
        var _a, _b;
        const { sduName, deployId, podName } = param;
        const { clusterName, namespace } = body;
        const [, killPodRequestError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill']({
            sduName,
            deployId,
            podName,
            clusterName,
            namespace,
        }));
        if (killPodRequestError) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = killPodRequestError === null || killPodRequestError === void 0 ? void 0 : killPodRequestError.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = killPodRequestError === null || killPodRequestError === void 0 ? void 0 : killPodRequestError.response) === null || _b === void 0 ? void 0 : _b.data,
            });
        }
    }
};
PodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fetch_service_1.FetchService])
], PodService);
exports.PodService = PodService;
//# sourceMappingURL=pod.service.js.map
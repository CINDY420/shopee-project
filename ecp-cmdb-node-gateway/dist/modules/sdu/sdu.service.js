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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SduService = void 0;
const common_1 = require("@nestjs/common");
const list_query_dto_1 = require("../../helpers/models/list-query.dto");
const fetch_service_1 = require("../fetch/fetch.service");
const exception_1 = require("@infra-node-kit/exception");
const error_1 = require("../../helpers/constants/error");
const utils_1 = require("@infra/utils");
const util_1 = require("util");
const try_get_message_1 = require("../../helpers/utils/try-get-message");
const logger_1 = require("@infra-node-kit/logger");
let SduService = class SduService {
    constructor(fetchService) {
        this.fetchService = fetchService;
        this.convertMegaByteToGigabyte = (megabyte) => Math.floor(megabyte / 1024);
        this.convertGigabyteToMegabyte = (gigabyte) => Math.floor(gigabyte * 1024);
    }
    async ping() {
        return await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/check']());
    }
    async listSdus(param, query) {
        var _a, _b;
        const { serviceId } = param;
        const { sduFilterBy } = query;
        const [sduList, listSduError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/services/{serviceId}/sdus']({ serviceId }));
        if (listSduError) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = listSduError === null || listSduError === void 0 ? void 0 : listSduError.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = listSduError === null || listSduError === void 0 ? void 0 : listSduError.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        const { items } = sduList;
        const res = await Promise.allSettled(items.map(async (item) => {
            const { sdu, identifier } = item, rest = __rest(item, ["sdu", "identifier"]);
            const [summaryData, summaryError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/summary']({ sduName: sdu }));
            if (summaryError) {
                logger_1.logger.error('OpenApi request summary errors:', summaryError);
            }
            const [deployments, deploymentsError] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']({ sduName: sdu }));
            if (deploymentsError) {
                logger_1.logger.error('OpenApi request deployments errors:', deploymentsError);
            }
            const summary = summaryData === null || summaryData === void 0 ? void 0 : summaryData.summary;
            const items = (deployments === null || deployments === void 0 ? void 0 : deployments.items) || [];
            const validSummary = summary
                ? {
                    targetInstances: summary.targetInstances,
                    unhealthyInstances: summary.unhealthyInstances,
                    state: summary.state,
                    disk: this.convertGigabyteToMegabyte(summary.disk),
                    cpu: summary.cpu,
                    mem: this.convertMegaByteToGigabyte(summary.mem),
                    lastDeployed: summary.lastDeployed,
                }
                : {
                    targetInstances: 0,
                    unhealthyInstances: 0,
                    state: 'Abnormal',
                    disk: 0,
                    cpu: 0,
                    mem: 0,
                    lastDeployed: 0,
                };
            const filterList = list_query_dto_1.ListQuery.parseFilterBy(sduFilterBy);
            const newSources = list_query_dto_1.ListQuery.getFilteredData(filterList, items);
            const formattedDeployments = newSources.map((deployment) => {
                const { deployId, sduName, azV1, cluster, componentType, status, summary, deployEngine } = deployment;
                const { containers, orchestrator, reason } = status;
                const { targetInstances, unhealthyInstances, state, disk, cpu, mem, lastDeployed } = summary;
                return {
                    deployId,
                    sduName,
                    azV1,
                    cluster,
                    deployEngine,
                    componentType,
                    status: {
                        containers,
                        orchestrator,
                        reason,
                    },
                    summary: {
                        targetInstances,
                        unhealthyInstances,
                        state,
                        disk: this.convertGigabyteToMegabyte(disk),
                        cpu,
                        mem: this.convertMegaByteToGigabyte(mem),
                        lastDeployed,
                    },
                };
            });
            return Object.assign(Object.assign({ sdu }, rest), { identifier, summary: validSummary, deployments: formattedDeployments });
        }));
        const fulfilledData = [];
        res === null || res === void 0 ? void 0 : res.forEach((item) => {
            if (item.status === 'fulfilled') {
                fulfilledData.push(item.value);
            }
        });
        return {
            items: fulfilledData,
            total: fulfilledData.length,
            totalOfInstances: 0,
        };
    }
    async listSDUHpaEnabledAZs(param) {
        var _a, _b;
        const { sduName } = param;
        const [sduHpas, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/hpas']({ sduName }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        const { items } = sduHpas;
        const azs = items === null || items === void 0 ? void 0 : items.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.meta) === null || _a === void 0 ? void 0 : _a.az; });
        return {
            azs,
        };
    }
    async getEnabledSduAutoScale(_param, query) {
        var _a, _b;
        const { project, module } = query;
        const [data, error] = await (0, utils_1.tryCatch)(this.fetchService.spaceFetch['GET/apis/autoscaler/v1/service/acknowledgement_status']({
            project,
            module,
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        const { toggle_state } = data;
        return {
            enabledAutoScale: toggle_state === 1,
        };
    }
    async scaleSDU(param, body) {
        const { sduName } = param;
        const { deployments } = body;
        const results = await Promise.allSettled((await Promise.resolve(Object.entries(deployments))).map(async ([deployId, data]) => {
            var _a;
            const { instances } = data;
            const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale'](Object.assign({ sduName,
                deployId }, instances)));
            if (error) {
                const _b = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, { message } = _b, others = __rest(_b, ["message"]);
                const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                const { meta } = data;
                const { az, componentType } = meta;
                const deployScaleErrorMessage = `${sduName}/${az}/${componentType} scale failed: ${message}`;
                (0, exception_1.throwError)(Object.assign(Object.assign({}, others), { message: (0, util_1.format)(deployScaleErrorMessage, errorMessage) }));
            }
            return res;
        }));
        const failedScale = results.filter((scale) => scale.status === 'rejected');
        if (failedScale.length > 0) {
            const errors = failedScale.map((scale) => scale === null || scale === void 0 ? void 0 : scale.reason).join(', ');
            (0, exception_1.throwError)({ message: errors });
        }
        return;
    }
    async getUnboundSDUs() {
        var _a, _b;
        const [data, error] = await (0, utils_1.tryCatch)(this.fetchService.spaceFetch['GET/apis/cmdb/v2/service/get_unbounded_sdus']({
            resource_type: 'CONTAINER',
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        const { sdu: sduList = [] } = data;
        const sdus = sduList.map((item) => item.sdu);
        return { sdus };
    }
    async bindSDUs(param, body) {
        const { serviceName } = param;
        const { sdus, force } = body;
        const results = await Promise.allSettled(sdus.map(async (sdu) => {
            var _a;
            const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.spaceFetch['POST/apis/cmdb/v2/service/bind_sdu']({
                service_name: serviceName,
                sdu,
                resource_type: 'CONTAINER',
                force,
            }));
            if (error) {
                const _b = error_1.ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR, { message } = _b, others = __rest(_b, ["message"]);
                const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                const bindSDUErrorMessage = `${sdu} bind failed: ${message}`;
                (0, exception_1.throwError)(Object.assign(Object.assign({}, others), { message: (0, util_1.format)(bindSDUErrorMessage, errorMessage) }));
            }
            return res;
        }));
        const failedBind = results.filter((bind) => bind.status === 'rejected');
        if (failedBind.length > 0) {
            const errors = failedBind.map((bind) => bind === null || bind === void 0 ? void 0 : bind.reason).join(', ');
            (0, exception_1.throwError)({ message: errors });
        }
        return;
    }
    async unbindSDU(param) {
        var _a, _b;
        const { serviceName, sdu } = param;
        const [, error] = await (0, utils_1.tryCatch)(this.fetchService.spaceFetch['POST/apis/cmdb/v2/service/unbind_sdu']({
            service_name: serviceName,
            resource_type: 'CONTAINER',
            sdu,
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        return;
    }
    async restartSDU(param, body) {
        const { sduName } = param;
        const { deployRestarts } = body;
        const results = await Promise.allSettled(deployRestarts.map(async (deployRestart) => {
            var _a;
            const { deployId, phases } = deployRestart;
            const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart']({
                sduName,
                deployId,
                phases,
            }));
            if (error) {
                const _b = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, { message } = _b, others = __rest(_b, ["message"]);
                const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                const deployRestartErrorMessage = `${sduName}-${deployId}/restart failed: ${message}`;
                (0, exception_1.throwError)(Object.assign(Object.assign({}, others), { message: (0, util_1.format)(deployRestartErrorMessage, errorMessage) }));
            }
            return res;
        }));
        const failedRestarts = results.filter((restart) => restart.status === 'rejected');
        if (failedRestarts.length > 0) {
            const errors = failedRestarts
                .map((restart) => restart === null || restart === void 0 ? void 0 : restart.reason)
                .join(', ');
            (0, exception_1.throwError)({ message: errors });
        }
        return;
    }
    async suspendSDU(param, body) {
        const { sduName } = param;
        const { deployIds } = body;
        const results = await Promise.allSettled(deployIds.map(async (deployId) => {
            var _a;
            const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend']({
                sduName,
                deployId,
            }));
            if (error) {
                const _b = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, { message } = _b, others = __rest(_b, ["message"]);
                const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                const deploySuspendErrorMessage = `${sduName}-${deployId}/suspend failed: ${message}`;
                (0, exception_1.throwError)(Object.assign(Object.assign({}, others), { message: (0, util_1.format)(deploySuspendErrorMessage, errorMessage) }));
            }
            return res;
        }));
        const failedSuspends = results.filter((suspend) => suspend.status === 'rejected');
        if (failedSuspends.length > 0) {
            const errors = failedSuspends
                .map((suspend) => suspend === null || suspend === void 0 ? void 0 : suspend.reason)
                .join(', ');
            (0, exception_1.throwError)({ message: errors });
        }
        return;
    }
    async stoptSDU(param, body) {
        const { sduName } = param;
        const { deployIds } = body;
        const results = await Promise.allSettled(deployIds.map(async (deployId) => {
            var _a;
            const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop']({
                sduName,
                deployId,
            }));
            if (error) {
                const _b = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, { message } = _b, others = __rest(_b, ["message"]);
                const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                const deployStopErrorMessage = `${sduName}-${deployId}/stop failed: ${message}`;
                (0, exception_1.throwError)(Object.assign(Object.assign({}, others), { message: (0, util_1.format)(deployStopErrorMessage, errorMessage) }));
            }
            return res;
        }));
        const failedStops = results.filter((stop) => stop.status === 'rejected');
        if (failedStops.length > 0) {
            const errors = failedStops.map((stop) => stop === null || stop === void 0 ? void 0 : stop.reason).join(', ');
            (0, exception_1.throwError)({ message: errors });
        }
        return;
    }
};
SduService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fetch_service_1.FetchService])
], SduService);
exports.SduService = SduService;
//# sourceMappingURL=sdu.service.js.map
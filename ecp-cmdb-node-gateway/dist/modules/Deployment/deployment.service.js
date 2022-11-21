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
exports.DeploymentService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@infra/utils");
const exception_1 = require("@infra-node-kit/exception");
const error_1 = require("../../helpers/constants/error");
const util_1 = require("util");
const try_get_message_1 = require("../../helpers/utils/try-get-message");
const fetch_service_1 = require("../fetch/fetch.service");
let DeploymentService = class DeploymentService {
    constructor(fetchService) {
        this.fetchService = fetchService;
    }
    async getDeploymentMeta(param) {
        var _a, _b;
        const { sduName, deployId } = param;
        const [res, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/meta']({
            sduName,
            deployId,
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data,
            });
        }
        const { deployment } = res;
        const { project, module, env, cid, azV1, azV2, deployEngine, cluster, clusterType, componentType, summary, status, } = deployment;
        const { releaseInstances, canaryInstances } = summary;
        const { containers } = status;
        return {
            project,
            module,
            env,
            cid,
            azV1,
            azV2,
            deployEngine,
            cluster,
            clusterType,
            componentType,
            releaseInstances,
            canaryInstances,
            containers,
        };
    }
    async listDeployments(param, query) {
        var _a, _b;
        const { sduName } = param;
        const { withDetail } = query;
        const [deployments, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['GET/ecpapi/v2/sdus/{sduName}/svcdeploys']({
            sduName,
            withdetail: withDetail,
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        return deployments;
    }
    async scaleDeployment(param, body) {
        var _a, _b;
        const { sduName, deployId } = param;
        const { releaseReplicas, canaryReplicas, canaryValid } = body;
        const [_, error] = await (0, utils_1.tryCatch)(this.fetchService.cmdbFetch['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:scale']({
            sduName,
            deployId,
            releaseReplicas,
            canaryReplicas,
            canaryValid,
        }));
        if (error) {
            const { message, status } = error_1.ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR;
            const errorMessage = (0, try_get_message_1.tryGetMessage)((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            (0, exception_1.throwError)({
                status,
                message: (0, util_1.format)(message, errorMessage),
                data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.message,
            });
        }
        return;
    }
};
DeploymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fetch_service_1.FetchService])
], DeploymentService);
exports.DeploymentService = DeploymentService;
//# sourceMappingURL=deployment.service.js.map
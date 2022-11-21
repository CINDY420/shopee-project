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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SduController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const sdu_service_1 = require("./sdu.service");
const pagination_inteceptor_1 = require("../../helpers/interceptors/pagination.inteceptor");
const pagination_1 = require("../../helpers/decorators/parameters/pagination");
const swagger_1 = require("@nestjs/swagger");
const list_sdu_dto_1 = require("./dtos/list-sdu.dto");
const space_auth_1 = require("@infra-node-kit/space-auth");
const list_sdu_hpa_enabled_azs_dto_1 = require("./dtos/list-sdu-hpa-enabled-azs.dto");
const scale_sdu_dto_1 = require("./dtos/scale-sdu.dto");
const get_enabled_sdu_auto_scaler_dto_1 = require("./dtos/get-enabled-sdu-auto-scaler.dto");
const bind_sdus_dto_1 = require("./dtos/bind-sdus.dto");
const unbind_sdu_dto_1 = require("./dtos/unbind-sdu.dto");
const restart_sdu_dto_1 = require("./dtos/restart-sdu.dto");
const suspend_sdu_dto_1 = require("./dtos/suspend-sdu.dto");
const stop_sdu_dto_1 = require("./dtos/stop-sdu.dto");
let SduController = class SduController {
    constructor(sduService) {
        this.sduService = sduService;
    }
    async ping() {
        return await this.sduService.ping();
    }
    async listSdus(param, query) {
        return await this.sduService.listSdus(param, query);
    }
    async listSDUHpaEnabledAZs(param) {
        return await this.sduService.listSDUHpaEnabledAZs(param);
    }
    async getEnabledSduAutoScale(param, query) {
        return await this.sduService.getEnabledSduAutoScale(param, query);
    }
    async scaleSDU(param, body) {
        return await this.sduService.scaleSDU(param, body);
    }
    async getUnboundSDUs() {
        return await this.sduService.getUnboundSDUs();
    }
    async bindSDUs(param, body) {
        return await this.sduService.bindSDUs(param, body);
    }
    async unbindSDU(param) {
        return await this.sduService.unbindSDU(param);
    }
    async restartSDU(param, body) {
        return await this.sduService.restartSDU(param, body);
    }
    async suspendSDU(param, body) {
        return await this.sduService.suspendSDU(param, body);
    }
    async stopSDU(param, body) {
        return await this.sduService.stoptSDU(param, body);
    }
};
__decorate([
    (0, common_1.Get)('/ping'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SduController.prototype, "ping", null);
__decorate([
    (0, pagination_1.Pagination)({
        key: 'items',
        countKey: 'total',
        defaultOrder: 'summary.targetInstances desc',
        canPaginationFilter: true,
        canPaginationSearch: true,
        operationAfterInterceptor: (sduList) => {
            const totalOfInstances = sduList.items.reduce((acc, curr) => { var _a; return acc + ((_a = curr === null || curr === void 0 ? void 0 : curr.summary) === null || _a === void 0 ? void 0 : _a.targetInstances); }, 0);
            return {
                totalOfInstances,
            };
        },
    }),
    (0, common_1.UseInterceptors)(pagination_inteceptor_1.PaginateInterceptor),
    (0, common_1.Get)('/services/:serviceId'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/list-sdu.dto").ListSduResponse }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_sdu_dto_1.ListSduParam,
        list_sdu_dto_1.ListSduQuery]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "listSdus", null);
__decorate([
    (0, common_1.Get)('/sdus/:sduName/hpa[:]enabledAZs'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/list-sdu-hpa-enabled-azs.dto").ListSDUHpaEnabledAZsResponse }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_sdu_hpa_enabled_azs_dto_1.ListSDUHpaEnabledAZsParam]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "listSDUHpaEnabledAZs", null);
__decorate([
    (0, common_1.Get)('/sdus/:sduName/autoScale[:]enabled'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/get-enabled-sdu-auto-scaler.dto").GetEnabledSduAutoScalerBody }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_enabled_sdu_auto_scaler_dto_1.GetEnabledSduAutoScalerParam,
        get_enabled_sdu_auto_scaler_dto_1.GetEnabledSduAutoScalerQuery]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "getEnabledSduAutoScale", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName[:]scale'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scale_sdu_dto_1.ScaleSDUParam, scale_sdu_dto_1.ScaleSDUBody]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "scaleSDU", null);
__decorate([
    (0, common_1.Get)('/sdus[:]unbound'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/get-unbound-sdus.dto").GetUnboundSDUsResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SduController.prototype, "getUnboundSDUs", null);
__decorate([
    (0, common_1.Post)('/services/:serviceName/sdus[:]bind'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bind_sdus_dto_1.BindSDUsParam, bind_sdus_dto_1.BindSDUsBody]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "bindSDUs", null);
__decorate([
    (0, common_1.Post)('/services/:serviceName/sdus/:sduName[:]unbind'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unbind_sdu_dto_1.UnbindSDUParam]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "unbindSDU", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName[:]restart'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restart_sdu_dto_1.RestartSDUParam,
        restart_sdu_dto_1.RestartSDUBody]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "restartSDU", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName[:]suspend'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [suspend_sdu_dto_1.SuspendSDUParam,
        suspend_sdu_dto_1.SuspendSDUBody]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "suspendSDU", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName[:]stop'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stop_sdu_dto_1.StopSDUParam, stop_sdu_dto_1.StopSDUBody]),
    __metadata("design:returntype", Promise)
], SduController.prototype, "stopSDU", null);
SduController = __decorate([
    (0, swagger_1.ApiTags)('SDU'),
    (0, space_auth_1.RequireLogin)(true),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [sdu_service_1.SduService])
], SduController);
exports.SduController = SduController;
//# sourceMappingURL=sdu.controller.js.map
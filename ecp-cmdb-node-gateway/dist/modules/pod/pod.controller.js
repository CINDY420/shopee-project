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
exports.PodController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const space_auth_1 = require("@infra-node-kit/space-auth");
const pod_service_1 = require("./pod.service");
const pagination_1 = require("../../helpers/decorators/parameters/pagination");
const pagination_inteceptor_1 = require("../../helpers/interceptors/pagination.inteceptor");
const pod_dto_1 = require("./dto/pod.dto");
let PodController = class PodController {
    constructor(podService) {
        this.podService = podService;
    }
    async listDeploymentPods(param, query) {
        return await this.podService.listDeploymentPods(param, query);
    }
    async killPod(param, body) {
        return await this.podService.killPod(param, body);
    }
};
__decorate([
    (0, pagination_1.Pagination)({
        key: 'items',
        countKey: 'total',
        defaultOrder: 'createdTime desc',
        canPaginationFilter: false,
        canPaginationSearch: false,
    }),
    (0, common_1.UseInterceptors)(pagination_inteceptor_1.PaginateInterceptor),
    (0, common_1.Get)('/sdus/:sduName/svcdeploys/:deployId/pods'),
    openapi.ApiResponse({ status: 200, type: require("./dto/pod.dto").ListDeploymentPodResponse }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pod_dto_1.ListDeploymentPodParam,
        pod_dto_1.ListDeploymentPodQuery]),
    __metadata("design:returntype", Promise)
], PodController.prototype, "listDeploymentPods", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName/svcdeploys/:deployId/pods/:podName[:]kill'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pod_dto_1.KillPodParam, pod_dto_1.KillPodBody]),
    __metadata("design:returntype", Promise)
], PodController.prototype, "killPod", null);
PodController = __decorate([
    (0, swagger_1.ApiTags)('Pod'),
    (0, space_auth_1.RequireLogin)(true),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [pod_service_1.PodService])
], PodController);
exports.PodController = PodController;
//# sourceMappingURL=pod.controller.js.map
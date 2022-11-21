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
exports.DeploymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const deployment_service_1 = require("./deployment.service");
const swagger_1 = require("@nestjs/swagger");
const space_auth_1 = require("@infra-node-kit/space-auth");
const deployment_dto_1 = require("./dtos/deployment.dto");
const list_deployments_dto_1 = require("./dtos/list-deployments.dto");
const scale_deployment_dto_1 = require("./dtos/scale-deployment.dto");
let DeploymentController = class DeploymentController {
    constructor(deploymentService) {
        this.deploymentService = deploymentService;
    }
    async getDeploymentMeta(param) {
        return await this.deploymentService.getDeploymentMeta(param);
    }
    async listDeployments(param, query) {
        return await this.deploymentService.listDeployments(param, query);
    }
    async scaleDeployment(param, body) {
        return await this.deploymentService.scaleDeployment(param, body);
    }
};
__decorate([
    (0, common_1.Get)('/sdus/:sduName/svcdeploys/:deployId/meta'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/deployment.dto").GetDeploymentMetaResponse }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deployment_dto_1.GetDeploymentMetaParam]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "getDeploymentMeta", null);
__decorate([
    (0, common_1.Get)('/sdus/:sduName/deploys'),
    openapi.ApiResponse({ status: 200, type: require("./dtos/list-deployments.dto").ListDeploymentsResponse }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_deployments_dto_1.ListDeploymentsParam,
        list_deployments_dto_1.ListDeploymentsQuery]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "listDeployments", null);
__decorate([
    (0, common_1.Post)('/sdus/:sduName/deploys/:deployId[:]scale'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scale_deployment_dto_1.ScaleDeploymentParam,
        scale_deployment_dto_1.ScaleDeploymentBody]),
    __metadata("design:returntype", Promise)
], DeploymentController.prototype, "scaleDeployment", null);
DeploymentController = __decorate([
    (0, swagger_1.ApiTags)('Deployment'),
    (0, space_auth_1.RequireLogin)(true),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [deployment_service_1.DeploymentService])
], DeploymentController);
exports.DeploymentController = DeploymentController;
//# sourceMappingURL=deployment.controller.js.map
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
exports.ServiceDeploymentContainer = exports.ServiceDeploymentStatus = exports.ServiceDeploymentSummary = exports.ServiceDeployment = exports.ListDeploymentsResponse = exports.ListDeploymentsQuery = exports.ListDeploymentsParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ListDeploymentsParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ListDeploymentsParam.prototype, "sduName", void 0);
exports.ListDeploymentsParam = ListDeploymentsParam;
class ListDeploymentsQuery {
    static _OPENAPI_METADATA_FACTORY() {
        return { withDetail: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ListDeploymentsQuery.prototype, "withDetail", void 0);
exports.ListDeploymentsQuery = ListDeploymentsQuery;
class ListDeploymentsResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./list-deployments.dto").ServiceDeployment] }, total: { required: true, type: () => Number } };
    }
}
exports.ListDeploymentsResponse = ListDeploymentsResponse;
class ServiceDeployment {
    static _OPENAPI_METADATA_FACTORY() {
        return { deployId: { required: true, type: () => String }, sduName: { required: true, type: () => String }, project: { required: true, type: () => String }, module: { required: true, type: () => String }, env: { required: true, type: () => String }, cid: { required: true, type: () => String }, feature: { required: true, type: () => String }, bundle: { required: true, type: () => String }, azV1: { required: true, type: () => String }, azV2: { required: true, type: () => String }, cluster: { required: true, type: () => String }, clusterType: { required: true, type: () => String }, deployEngine: { required: true, type: () => String }, componentType: { required: true, type: () => String }, summary: { required: true, type: () => require("./list-deployments.dto").ServiceDeploymentSummary }, status: { required: true, type: () => require("./list-deployments.dto").ServiceDeploymentStatus } };
    }
}
exports.ServiceDeployment = ServiceDeployment;
class ServiceDeploymentSummary {
    static _OPENAPI_METADATA_FACTORY() {
        return { cpu: { required: true, type: () => Number }, mem: { required: true, type: () => Number }, disk: { required: true, type: () => Number }, healthyInstances: { required: true, type: () => Number }, killingInstances: { required: true, type: () => Number }, runningInstances: { required: true, type: () => Number }, stagingInstances: { required: true, type: () => Number }, startingInstances: { required: true, type: () => Number }, targetInstances: { required: true, type: () => Number }, unhealthyInstances: { required: true, type: () => Number }, unknownInstances: { required: true, type: () => Number }, releaseInstances: { required: true, type: () => Number }, canaryInstances: { required: true, type: () => Number }, state: { required: true, type: () => String }, lastDeployed: { required: true, type: () => Number } };
    }
}
exports.ServiceDeploymentSummary = ServiceDeploymentSummary;
class ServiceDeploymentStatus {
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: true, type: () => String }, orchestrator: { required: true, type: () => String }, containers: { required: true, type: () => [require("./list-deployments.dto").ServiceDeploymentContainer] } };
    }
}
exports.ServiceDeploymentStatus = ServiceDeploymentStatus;
class ServiceDeploymentContainer {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, image: { required: true, type: () => String }, phase: { required: true, type: () => String }, tag: { required: true, type: () => String } };
    }
}
exports.ServiceDeploymentContainer = ServiceDeploymentContainer;
//# sourceMappingURL=list-deployments.dto.js.map
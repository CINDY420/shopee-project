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
exports.Summary = exports.Identifier = exports.Deployment = exports.SduList = exports.ListSduResponse = exports.ListSduQuery = exports.ListSduParam = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ListSduParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ListSduParam.prototype, "serviceId", void 0);
exports.ListSduParam = ListSduParam;
class ListSduQuery {
    static _OPENAPI_METADATA_FACTORY() {
        return { searchBy: { required: false, type: () => String }, filterBy: { required: false, type: () => String }, sduFilterBy: { required: false, type: () => String }, orderBy: { required: false, type: () => String }, offset: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListSduQuery.prototype, "searchBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListSduQuery.prototype, "filterBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListSduQuery.prototype, "sduFilterBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListSduQuery.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListSduQuery.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListSduQuery.prototype, "limit", void 0);
exports.ListSduQuery = ListSduQuery;
class ListSduResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./list-sdu.dto").SduList] }, total: { required: true, type: () => Number }, totalOfInstances: { required: true, type: () => Number } };
    }
}
exports.ListSduResponse = ListSduResponse;
class SduList {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduId: { required: true, type: () => Number }, serviceId: { required: true, type: () => Number }, sdu: { required: true, type: () => String }, resourceType: { required: true, type: () => String }, env: { required: true, type: () => String }, cid: { required: true, type: () => String }, idcs: { required: true, type: () => [Object] }, version: { required: true, type: () => String }, deploymentLink: { required: true, type: () => String }, serviceName: { required: true, type: () => String }, identifier: { required: true, type: () => require("./list-sdu.dto").Identifier }, summary: { required: true, type: () => require("./list-sdu.dto").Summary }, deployments: { required: true, type: () => [require("./list-sdu.dto").Deployment] } };
    }
}
exports.SduList = SduList;
class Deployment {
    static _OPENAPI_METADATA_FACTORY() {
        return { deployId: { required: true, type: () => String }, sduName: { required: true, type: () => String }, azV1: { required: true, type: () => String }, deployEngine: { required: true, type: () => String }, cluster: { required: true, type: () => String }, componentType: { required: true, type: () => String }, status: { required: true, type: () => DeploymentStatus }, summary: { required: true, type: () => DeploymentSummary } };
    }
}
exports.Deployment = Deployment;
class DeploymentStatus {
    static _OPENAPI_METADATA_FACTORY() {
        return { containers: { required: true, type: () => [Container] }, orchestrator: { required: true, type: () => String }, reason: { required: true, type: () => String } };
    }
}
class DeploymentSummary {
    static _OPENAPI_METADATA_FACTORY() {
        return { targetInstances: { required: true, type: () => Number }, unhealthyInstances: { required: true, type: () => Number }, state: { required: true, type: () => String }, disk: { required: true, type: () => Number }, cpu: { required: true, type: () => Number }, mem: { required: true, type: () => Number }, lastDeployed: { required: true, type: () => Number } };
    }
}
class Container {
    static _OPENAPI_METADATA_FACTORY() {
        return { phase: { required: true, type: () => String }, name: { required: true, type: () => String }, image: { required: true, type: () => String }, tag: { required: true, type: () => String } };
    }
}
class Identifier {
    static _OPENAPI_METADATA_FACTORY() {
        return { module: { required: true, type: () => String }, project: { required: true, type: () => String } };
    }
}
exports.Identifier = Identifier;
class Summary {
    static _OPENAPI_METADATA_FACTORY() {
        return { cpu: { required: true, type: () => Number }, mem: { required: true, type: () => Number }, disk: { required: true, type: () => Number }, lastDeployed: { required: true, type: () => Number }, state: { required: true, type: () => String }, targetInstances: { required: true, type: () => Number }, unhealthyInstances: { required: true, type: () => Number } };
    }
}
exports.Summary = Summary;
//# sourceMappingURL=list-sdu.dto.js.map
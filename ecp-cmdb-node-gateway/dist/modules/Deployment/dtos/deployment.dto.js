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
exports.GetDeploymentMetaResponse = exports.GetDeploymentMetaParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetDeploymentMetaParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String }, deployId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetDeploymentMetaParam.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetDeploymentMetaParam.prototype, "deployId", void 0);
exports.GetDeploymentMetaParam = GetDeploymentMetaParam;
class Container {
    static _OPENAPI_METADATA_FACTORY() {
        return { phase: { required: true, type: () => String }, name: { required: true, type: () => String }, image: { required: true, type: () => String }, tag: { required: true, type: () => String } };
    }
}
class GetDeploymentMetaResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { project: { required: true, type: () => String }, module: { required: true, type: () => String }, env: { required: true, type: () => String }, cid: { required: true, type: () => String }, azV1: { required: true, type: () => String }, azV2: { required: true, type: () => String }, deployEngine: { required: true, type: () => String }, cluster: { required: true, type: () => String }, clusterType: { required: true, type: () => String }, componentType: { required: true, type: () => String }, releaseInstances: { required: true, type: () => Number }, canaryInstances: { required: true, type: () => Number }, containers: { required: true, type: () => [Container] } };
    }
}
exports.GetDeploymentMetaResponse = GetDeploymentMetaResponse;
//# sourceMappingURL=deployment.dto.js.map
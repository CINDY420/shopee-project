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
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto = exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto = exports.Item99477 = exports.Item99484 = exports.Item99485 = exports.Item99508 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99508 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'image': { required: true, type: () => String }, 'name': { required: true, type: () => String }, 'phase': { required: true, type: () => String }, 'tag': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99508.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99508.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99508.prototype, "phase", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99508.prototype, "tag", void 0);
exports.Item99508 = Item99508;
class Item99485 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'containers': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys-{deployId}-meta.dto").Item99508] }, 'orchestrator': { required: true, type: () => String }, 'reason': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99508),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99485.prototype, "containers", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99485.prototype, "orchestrator", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99485.prototype, "reason", void 0);
exports.Item99485 = Item99485;
class Item99484 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canaryInstances': { required: true, type: () => Number }, 'cpu': { required: true, type: () => Number }, 'disk': { required: true, type: () => Number }, 'healthyInstances': { required: true, type: () => Number }, 'killingInstances': { required: true, type: () => Number }, 'lastDeployed': { required: true, type: () => Number }, 'mem': { required: true, type: () => Number }, 'releaseInstances': { required: true, type: () => Number }, 'runningInstances': { required: true, type: () => Number }, 'stagingInstances': { required: true, type: () => Number }, 'startingInstances': { required: true, type: () => Number }, 'state': { required: true, type: () => String }, 'targetInstances': { required: true, type: () => Number }, 'unhealthyInstances': { required: true, type: () => Number }, 'unknownInstances': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "canaryInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "healthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "killingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "lastDeployed", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "mem", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "releaseInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "runningInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "stagingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "startingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99484.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "targetInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "unhealthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99484.prototype, "unknownInstances", void 0);
exports.Item99484 = Item99484;
class Item99477 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'azV1': { required: true, type: () => String }, 'azV2': { required: true, type: () => String }, 'bundle': { required: true, type: () => String }, 'cid': { required: true, type: () => String }, 'cluster': { required: true, type: () => String }, 'clusterType': { required: true, type: () => String }, 'componentType': { required: true, type: () => String }, 'deployEngine': { required: true, type: () => String }, 'deployId': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'feature': { required: true, type: () => String }, 'module': { required: true, type: () => String }, 'project': { required: true, type: () => String }, 'sduName': { required: true, type: () => String }, 'status': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys-{deployId}-meta.dto").Item99485 }, 'summary': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys-{deployId}-meta.dto").Item99484 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "azV1", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "azV2", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "bundle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "clusterType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "componentType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "deployEngine", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "feature", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99477.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99485),
    __metadata("design:type", Item99485)
], Item99477.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99484),
    __metadata("design:type", Item99484)
], Item99477.prototype, "summary", void 0);
exports.Item99477 = Item99477;
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'deployId': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto.prototype, "deployId", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto;
class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'deployment': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys-{deployId}-meta.dto").Item99477 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99477),
    __metadata("design:type", Item99477)
], GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto.prototype, "deployment", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto = GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys-%7BdeployId%7D-meta.dto.js.map
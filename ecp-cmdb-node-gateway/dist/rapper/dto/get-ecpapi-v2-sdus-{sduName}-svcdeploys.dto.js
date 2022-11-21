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
exports.GetEcpapiV2Sdus1SduNameSvcdeploysResDto = exports.GetEcpapiV2Sdus1SduNameSvcdeploysReqDto = exports.Item99435 = exports.Item99448 = exports.Item99451 = exports.Item99455 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99455 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'image': { required: true, type: () => String }, 'name': { required: true, type: () => String }, 'phase': { required: true, type: () => String }, 'tag': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99455.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99455.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99455.prototype, "phase", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99455.prototype, "tag", void 0);
exports.Item99455 = Item99455;
class Item99451 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'containers': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys.dto").Item99455] }, 'orchestrator': { required: true, type: () => String }, 'reason': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99455),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99451.prototype, "containers", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99451.prototype, "orchestrator", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99451.prototype, "reason", void 0);
exports.Item99451 = Item99451;
class Item99448 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canaryInstances': { required: true, type: () => Number }, 'cpu': { required: true, type: () => Number }, 'disk': { required: true, type: () => Number }, 'healthyInstances': { required: true, type: () => Number }, 'killingInstances': { required: true, type: () => Number }, 'lastDeployed': { required: true, type: () => Number }, 'mem': { required: true, type: () => Number }, 'releaseInstances': { required: true, type: () => Number }, 'runningInstances': { required: true, type: () => Number }, 'stagingInstances': { required: true, type: () => Number }, 'startingInstances': { required: true, type: () => Number }, 'state': { required: true, type: () => String }, 'targetInstances': { required: true, type: () => Number }, 'unhealthyInstances': { required: true, type: () => Number }, 'unknownInstances': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "canaryInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "healthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "killingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "lastDeployed", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "mem", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "releaseInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "runningInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "stagingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "startingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99448.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "targetInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "unhealthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99448.prototype, "unknownInstances", void 0);
exports.Item99448 = Item99448;
class Item99435 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'azV1': { required: true, type: () => String }, 'azV2': { required: true, type: () => String }, 'bundle': { required: true, type: () => String }, 'cid': { required: true, type: () => String }, 'cluster': { required: true, type: () => String }, 'clusterType': { required: true, type: () => String }, 'componentType': { required: true, type: () => String }, 'deployEngine': { required: true, type: () => String }, 'deployId': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'feature': { required: true, type: () => String }, 'module': { required: true, type: () => String }, 'project': { required: true, type: () => String }, 'sduName': { required: true, type: () => String }, 'status': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys.dto").Item99451 }, 'summary': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys.dto").Item99448 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "azV1", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "azV2", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "bundle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "clusterType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "componentType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "deployEngine", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "feature", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99435.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99451),
    __metadata("design:type", Item99451)
], Item99435.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99448),
    __metadata("design:type", Item99448)
], Item99435.prototype, "summary", void 0);
exports.Item99435 = Item99435;
class GetEcpapiV2Sdus1SduNameSvcdeploysReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String }, 'withdetail': { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSvcdeploysReqDto.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetEcpapiV2Sdus1SduNameSvcdeploysReqDto.prototype, "withdetail", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploysReqDto = GetEcpapiV2Sdus1SduNameSvcdeploysReqDto;
class GetEcpapiV2Sdus1SduNameSvcdeploysResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-svcdeploys.dto").Item99435] }, 'total': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99435),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Sdus1SduNameSvcdeploysResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetEcpapiV2Sdus1SduNameSvcdeploysResDto.prototype, "total", void 0);
exports.GetEcpapiV2Sdus1SduNameSvcdeploysResDto = GetEcpapiV2Sdus1SduNameSvcdeploysResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-svcdeploys.dto.js.map
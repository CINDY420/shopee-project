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
exports.GetEcpapiV2Sdus1SduNameSummaryResDto = exports.GetEcpapiV2Sdus1SduNameSummaryReqDto = exports.Item99569 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99569 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'canaryInstances': { required: true, type: () => Number }, 'cpu': { required: true, type: () => Number }, 'disk': { required: true, type: () => Number }, 'healthyInstances': { required: true, type: () => Number }, 'killingInstances': { required: true, type: () => Number }, 'lastDeployed': { required: true, type: () => Number }, 'mem': { required: true, type: () => Number }, 'releaseInstances': { required: true, type: () => Number }, 'runningInstances': { required: true, type: () => Number }, 'stagingInstances': { required: true, type: () => Number }, 'startingInstances': { required: true, type: () => Number }, 'state': { required: true, type: () => String }, 'targetInstances': { required: true, type: () => Number }, 'unhealthyInstances': { required: true, type: () => Number }, 'unknownInstances': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "canaryInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "disk", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "healthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "killingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "lastDeployed", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "mem", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "releaseInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "runningInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "stagingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "startingInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99569.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "targetInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "unhealthyInstances", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99569.prototype, "unknownInstances", void 0);
exports.Item99569 = Item99569;
class GetEcpapiV2Sdus1SduNameSummaryReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameSummaryReqDto.prototype, "sduName", void 0);
exports.GetEcpapiV2Sdus1SduNameSummaryReqDto = GetEcpapiV2Sdus1SduNameSummaryReqDto;
class GetEcpapiV2Sdus1SduNameSummaryResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'summary': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-summary.dto").Item99569 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99569),
    __metadata("design:type", Item99569)
], GetEcpapiV2Sdus1SduNameSummaryResDto.prototype, "summary", void 0);
exports.GetEcpapiV2Sdus1SduNameSummaryResDto = GetEcpapiV2Sdus1SduNameSummaryResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-summary.dto.js.map
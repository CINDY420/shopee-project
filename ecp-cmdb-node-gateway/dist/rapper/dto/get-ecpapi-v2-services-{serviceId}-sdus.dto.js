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
exports.GetEcpapiV2Services1ServiceIdSdusResDto = exports.GetEcpapiV2Services1ServiceIdSdusReqDto = exports.Item99587 = exports.Item99594 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99594 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'module': { required: true, type: () => String }, 'project': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99594.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99594.prototype, "project", void 0);
exports.Item99594 = Item99594;
class Item99587 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'deploymentLink': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'idcs': { required: true, type: () => [Object] }, 'identifier': { required: true, type: () => require("./get-ecpapi-v2-services-{serviceId}-sdus.dto").Item99594 }, 'resourceType': { required: true, type: () => String }, 'sdu': { required: true, type: () => String }, 'sduId': { required: true, type: () => Number }, 'serviceId': { required: true, type: () => Number }, 'serviceName': { required: true, type: () => String }, 'version': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "deploymentLink", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99587.prototype, "idcs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99594),
    __metadata("design:type", Item99594)
], Item99587.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "resourceType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99587.prototype, "sduId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99587.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "serviceName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99587.prototype, "version", void 0);
exports.Item99587 = Item99587;
class GetEcpapiV2Services1ServiceIdSdusReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'serviceId': { required: true, type: () => String }, 'filterBy': { required: false, type: () => String, description: "support filter by env\u3001cid, Example: ?filter_by=env==test;cid==CN." }, 'keyword': { required: false, type: () => String, description: "keyword to search, support sdu name." } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Services1ServiceIdSdusReqDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Services1ServiceIdSdusReqDto.prototype, "filterBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Services1ServiceIdSdusReqDto.prototype, "keyword", void 0);
exports.GetEcpapiV2Services1ServiceIdSdusReqDto = GetEcpapiV2Services1ServiceIdSdusReqDto;
class GetEcpapiV2Services1ServiceIdSdusResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-services-{serviceId}-sdus.dto").Item99587] }, 'totalSize': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99587),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Services1ServiceIdSdusResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetEcpapiV2Services1ServiceIdSdusResDto.prototype, "totalSize", void 0);
exports.GetEcpapiV2Services1ServiceIdSdusResDto = GetEcpapiV2Services1ServiceIdSdusResDto;
//# sourceMappingURL=get-ecpapi-v2-services-%7BserviceId%7D-sdus.dto.js.map
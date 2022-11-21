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
exports.GetApisCmdbV2ServiceGetUnboundedSdusResDto = exports.GetApisCmdbV2ServiceGetUnboundedSdusReqDto = exports.Item141454 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item141454 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: true, type: () => String }, 'created_at': { required: true, type: () => Number }, 'deployment_link': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'idcs': { required: true, type: () => [Object] }, 'label': { required: true, type: () => require("./index").ItemEmpty }, 'resource_type': { required: true, type: () => String }, 'sdu': { required: true, type: () => String }, 'updated_at': { required: true, type: () => Number }, 'version': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141454.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "deployment_link", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item141454.prototype, "idcs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item141454.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "resource_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item141454.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item141454.prototype, "version", void 0);
exports.Item141454 = Item141454;
class GetApisCmdbV2ServiceGetUnboundedSdusReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'resource_type': { required: false, type: () => String, description: "APP/CONTAINER/PHYSICAL/STATIC\n\u9ED8\u8BA4APP" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetApisCmdbV2ServiceGetUnboundedSdusReqDto.prototype, "resource_type", void 0);
exports.GetApisCmdbV2ServiceGetUnboundedSdusReqDto = GetApisCmdbV2ServiceGetUnboundedSdusReqDto;
class GetApisCmdbV2ServiceGetUnboundedSdusResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sdu': { required: true, type: () => [require("./get-apis-cmdb-v2-service-get_unbounded_sdus.dto").Item141454] }, 'total_size': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item141454),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetApisCmdbV2ServiceGetUnboundedSdusResDto.prototype, "sdu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetApisCmdbV2ServiceGetUnboundedSdusResDto.prototype, "total_size", void 0);
exports.GetApisCmdbV2ServiceGetUnboundedSdusResDto = GetApisCmdbV2ServiceGetUnboundedSdusResDto;
//# sourceMappingURL=get-apis-cmdb-v2-service-get_unbounded_sdus.dto.js.map
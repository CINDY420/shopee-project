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
exports.GetEcpapiV2WorkloadsResDto = exports.GetEcpapiV2WorkloadsReqDto = exports.Item115131 = exports.Item115134 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item115134 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'category': { required: true, type: () => String }, 'name': { required: true, type: () => String }, 'nameDisplay': { required: true, type: () => String }, 'type': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115134.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115134.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115134.prototype, "nameDisplay", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115134.prototype, "type", void 0);
exports.Item115134 = Item115134;
class Item115131 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'workloads': { required: true, type: () => [require("./get-ecpapi-v2-workloads.dto").Item115134] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115131.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115131.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item115134),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item115131.prototype, "workloads", void 0);
exports.Item115131 = Item115131;
class GetEcpapiV2WorkloadsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'version': { required: false, type: () => String }, 'env': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2WorkloadsReqDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2WorkloadsReqDto.prototype, "env", void 0);
exports.GetEcpapiV2WorkloadsReqDto = GetEcpapiV2WorkloadsReqDto;
class GetEcpapiV2WorkloadsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-workloads.dto").Item115131] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item115131),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2WorkloadsResDto.prototype, "items", void 0);
exports.GetEcpapiV2WorkloadsResDto = GetEcpapiV2WorkloadsResDto;
//# sourceMappingURL=get-ecpapi-v2-workloads.dto.js.map
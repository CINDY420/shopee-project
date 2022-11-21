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
exports.GetEcpapiV2Az1AzKeyMappingResDto = exports.GetEcpapiV2Az1AzKeyMappingReqDto = exports.Item99378 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99378 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'azKey': { required: false, type: () => String }, 'version': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99378.prototype, "azKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99378.prototype, "version", void 0);
exports.Item99378 = Item99378;
class GetEcpapiV2Az1AzKeyMappingReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'azKey': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Az1AzKeyMappingReqDto.prototype, "azKey", void 0);
exports.GetEcpapiV2Az1AzKeyMappingReqDto = GetEcpapiV2Az1AzKeyMappingReqDto;
class GetEcpapiV2Az1AzKeyMappingResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'version': { required: false, type: () => String }, 'items': { required: false, type: () => [require("./get-ecpapi-v2-az-{azKey}-mapping.dto").Item99378] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Az1AzKeyMappingResDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99378),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Az1AzKeyMappingResDto.prototype, "items", void 0);
exports.GetEcpapiV2Az1AzKeyMappingResDto = GetEcpapiV2Az1AzKeyMappingResDto;
//# sourceMappingURL=get-ecpapi-v2-az-%7BazKey%7D-mapping.dto.js.map
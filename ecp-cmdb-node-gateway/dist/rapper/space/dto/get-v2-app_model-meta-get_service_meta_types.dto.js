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
exports.GetV2AppModelMetaGetServiceMetaTypesResDto = exports.GetV2AppModelMetaGetServiceMetaTypesReqDto = exports.Item115126 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item115126 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'name': { required: false, type: () => String }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115126.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item115126.prototype, "service_meta_type", void 0);
exports.Item115126 = Item115126;
class GetV2AppModelMetaGetServiceMetaTypesReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GetV2AppModelMetaGetServiceMetaTypesReqDto = GetV2AppModelMetaGetServiceMetaTypesReqDto;
class GetV2AppModelMetaGetServiceMetaTypesResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'types': { required: false, type: () => [require("./get-v2-app_model-meta-get_service_meta_types.dto").Item115126] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item115126),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV2AppModelMetaGetServiceMetaTypesResDto.prototype, "types", void 0);
exports.GetV2AppModelMetaGetServiceMetaTypesResDto = GetV2AppModelMetaGetServiceMetaTypesResDto;
//# sourceMappingURL=get-v2-app_model-meta-get_service_meta_types.dto.js.map
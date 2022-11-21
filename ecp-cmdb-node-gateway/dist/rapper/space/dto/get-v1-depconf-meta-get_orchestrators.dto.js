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
exports.GetV1DepconfMetaGetOrchestratorsResDto = exports.GetV1DepconfMetaGetOrchestratorsReqDto = exports.Item114662 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114662 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'env': { required: true, type: () => String }, 'idc': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114662.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114662.prototype, "idc", void 0);
exports.Item114662 = Item114662;
class GetV1DepconfMetaGetOrchestratorsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'service_name': { required: false, type: () => String, description: "CMDB Service name" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfMetaGetOrchestratorsReqDto.prototype, "service_name", void 0);
exports.GetV1DepconfMetaGetOrchestratorsReqDto = GetV1DepconfMetaGetOrchestratorsReqDto;
class GetV1DepconfMetaGetOrchestratorsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'not_active': { required: false, type: () => [require("./get-v1-depconf-meta-get_orchestrators.dto").Item114662] }, 'orchestrators': { required: false, type: () => require("./index").ItemEmpty } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114662),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfMetaGetOrchestratorsResDto.prototype, "not_active", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], GetV1DepconfMetaGetOrchestratorsResDto.prototype, "orchestrators", void 0);
exports.GetV1DepconfMetaGetOrchestratorsResDto = GetV1DepconfMetaGetOrchestratorsResDto;
//# sourceMappingURL=get-v1-depconf-meta-get_orchestrators.dto.js.map
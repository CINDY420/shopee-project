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
exports.GetEcpapiV2AzsResDto = exports.GetEcpapiV2AzsReqDto = exports.Item113696 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item113696 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'clusters': { required: true, type: () => [Object] }, 'env': { required: true, type: () => String }, 'name': { required: true, type: () => String }, 'type': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item113696.prototype, "clusters", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113696.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113696.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113696.prototype, "type", void 0);
exports.Item113696 = Item113696;
class GetEcpapiV2AzsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'version': { required: false, type: () => String }, 'env': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2AzsReqDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2AzsReqDto.prototype, "env", void 0);
exports.GetEcpapiV2AzsReqDto = GetEcpapiV2AzsReqDto;
class GetEcpapiV2AzsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-azs.dto").Item113696] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113696),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2AzsResDto.prototype, "items", void 0);
exports.GetEcpapiV2AzsResDto = GetEcpapiV2AzsResDto;
//# sourceMappingURL=get-ecpapi-v2-azs.dto.js.map
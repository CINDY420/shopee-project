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
exports.GetV1DepconfConfigGetCidsResDto = exports.GetV1DepconfConfigGetCidsReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetV1DepconfConfigGetCidsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: false, type: () => String, description: "CMDB Service ID. Specify this or project" }, 'env': { required: true, type: () => String, description: "environment" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetCidsReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetCidsReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetCidsReqDto.prototype, "env", void 0);
exports.GetV1DepconfConfigGetCidsReqDto = GetV1DepconfConfigGetCidsReqDto;
class GetV1DepconfConfigGetCidsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cids': { required: false, type: () => [Object] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfConfigGetCidsResDto.prototype, "cids", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfConfigGetCidsResDto.prototype, "success", void 0);
exports.GetV1DepconfConfigGetCidsResDto = GetV1DepconfConfigGetCidsResDto;
//# sourceMappingURL=get-v1-depconf-config-get_cids.dto.js.map
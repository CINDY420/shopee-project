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
exports.GetV1DepconfConfigGetGeneratedResDto = exports.GetV1DepconfConfigGetGeneratedReqDto = exports.Item114020 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114020 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'comment': { required: false, type: () => String }, 'commit_id': { required: false, type: () => Number }, 'created_by': { required: false, type: () => String }, 'created_ts': { required: false, type: () => Number }, 'data': { required: false, type: () => String }, 'deleted_at': { required: false, type: () => Number }, 'env': { required: false, type: () => String }, 'extra_data': { required: false, type: () => require("./index").ItemEmpty }, 'id': { required: false, type: () => Number }, 'modified_by': { required: false, type: () => String }, 'modified_ts': { required: false, type: () => Number }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "commit_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "created_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "deleted_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item114020.prototype, "extra_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "modified_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "modified_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114020.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item114020.prototype, "service_meta_type", void 0);
exports.Item114020 = Item114020;
class GetV1DepconfConfigGetGeneratedReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: false, type: () => String, description: "CMDB Service ID. Specify this or project" }, 'env': { required: true, type: () => String, description: "environment" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetGeneratedReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetGeneratedReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetGeneratedReqDto.prototype, "env", void 0);
exports.GetV1DepconfConfigGetGeneratedReqDto = GetV1DepconfConfigGetGeneratedReqDto;
class GetV1DepconfConfigGetGeneratedResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'configurations': { required: false, type: () => [require("./get-v1-depconf-config-get_generated.dto").Item114020] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'total_count': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114020),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfConfigGetGeneratedResDto.prototype, "configurations", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfConfigGetGeneratedResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfConfigGetGeneratedResDto.prototype, "total_count", void 0);
exports.GetV1DepconfConfigGetGeneratedResDto = GetV1DepconfConfigGetGeneratedResDto;
//# sourceMappingURL=get-v1-depconf-config-get_generated.dto.js.map
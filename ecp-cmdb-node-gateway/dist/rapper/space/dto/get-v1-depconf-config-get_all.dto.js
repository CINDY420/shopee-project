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
exports.GetV1DepconfConfigGetAllResDto = exports.GetV1DepconfConfigGetAllReqDto = exports.Item113992 = exports.Item114006 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item114006 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'has_next': { required: false, type: () => Boolean }, 'next_id': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item114006.prototype, "has_next", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item114006.prototype, "next_id", void 0);
exports.Item114006 = Item114006;
class Item113992 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'comment': { required: false, type: () => String }, 'commit_id': { required: false, type: () => Number }, 'created_by': { required: false, type: () => String }, 'created_ts': { required: false, type: () => Number }, 'data': { required: false, type: () => String }, 'deleted_at': { required: false, type: () => Number }, 'env': { required: false, type: () => String }, 'extra_data': { required: false, type: () => require("./index").ItemEmpty }, 'id': { required: false, type: () => Number }, 'modified_by': { required: false, type: () => String }, 'modified_ts': { required: false, type: () => Number }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "commit_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "created_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "deleted_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item113992.prototype, "extra_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "modified_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "modified_ts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113992.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113992.prototype, "service_meta_type", void 0);
exports.Item113992 = Item113992;
class GetV1DepconfConfigGetAllReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'env': { required: false, type: () => String, description: "Environment to retrieve from" }, 'next_id': { required: false, type: () => Number, description: "Next config ID to retrieve from (default: 0)" }, 'limit': { required: false, type: () => Number, description: "How many records to return (default: 50)" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfConfigGetAllReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfConfigGetAllReqDto.prototype, "next_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfConfigGetAllReqDto.prototype, "limit", void 0);
exports.GetV1DepconfConfigGetAllReqDto = GetV1DepconfConfigGetAllReqDto;
class GetV1DepconfConfigGetAllResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'configurations': { required: false, type: () => [require("./get-v1-depconf-config-get_all.dto").Item113992] }, 'meta': { required: false, type: () => require("./get-v1-depconf-config-get_all.dto").Item114006 }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'total_count': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113992),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfConfigGetAllResDto.prototype, "configurations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item114006),
    __metadata("design:type", Item114006)
], GetV1DepconfConfigGetAllResDto.prototype, "meta", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfConfigGetAllResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfConfigGetAllResDto.prototype, "total_count", void 0);
exports.GetV1DepconfConfigGetAllResDto = GetV1DepconfConfigGetAllResDto;
//# sourceMappingURL=get-v1-depconf-config-get_all.dto.js.map
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
exports.GetV1DepconfCommitGetInfoResDto = exports.GetV1DepconfCommitGetInfoReqDto = exports.Item113839 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item113839 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'comment': { required: true, type: () => String }, 'created_by': { required: true, type: () => String }, 'created_time': { required: true, type: () => Number }, 'data': { required: true, type: () => String }, 'env': { required: true, type: () => String }, 'extra_data': { required: true, type: () => require("./index").ItemEmpty }, 'id': { required: true, type: () => Number }, 'project': { required: true, type: () => String }, 'service_id': { required: true, type: () => Number }, 'service_meta_type': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113839.prototype, "created_time", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item113839.prototype, "extra_data", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113839.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item113839.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item113839.prototype, "service_meta_type", void 0);
exports.Item113839 = Item113839;
class GetV1DepconfCommitGetInfoReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: false, type: () => String, description: "Project module name (smm-api). Specify this or service_id" }, 'service_id': { required: false, type: () => String, description: "CMDB Service ID. Specify this or project" }, 'env': { required: true, type: () => String, description: "environment" }, 'commit_id': { required: false, type: () => String, description: "Commit ID" }, 'page': { required: false, type: () => Number, description: "Next page to retrieve (default: 1)" }, 'limit': { required: false, type: () => Number, description: "How many records to return (default: 50)" } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfCommitGetInfoReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfCommitGetInfoReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfCommitGetInfoReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetV1DepconfCommitGetInfoReqDto.prototype, "commit_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfCommitGetInfoReqDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfCommitGetInfoReqDto.prototype, "limit", void 0);
exports.GetV1DepconfCommitGetInfoReqDto = GetV1DepconfCommitGetInfoReqDto;
class GetV1DepconfCommitGetInfoResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'commits': { required: true, type: () => [require("./get-v1-depconf-commit-get_info.dto").Item113839] }, 'success': { required: true, type: () => Boolean, description: "\u8BF7\u6C42\u4E1A\u52A1\u7ED3\u679C" }, 'total_count': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item113839),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetV1DepconfCommitGetInfoResDto.prototype, "commits", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetV1DepconfCommitGetInfoResDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetV1DepconfCommitGetInfoResDto.prototype, "total_count", void 0);
exports.GetV1DepconfCommitGetInfoResDto = GetV1DepconfCommitGetInfoResDto;
//# sourceMappingURL=get-v1-depconf-commit-get_info.dto.js.map
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
exports.PostV1DepconfCommitCreateResDto = exports.PostV1DepconfCommitCreateReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostV1DepconfCommitCreateReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'comment': { required: false, type: () => String }, 'data': { required: false, type: () => String }, 'email': { required: false, type: () => String }, 'env': { required: false, type: () => String }, 'extra_data': { required: false, type: () => String }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "extra_data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV1DepconfCommitCreateReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfCommitCreateReqDto.prototype, "service_meta_type", void 0);
exports.PostV1DepconfCommitCreateReqDto = PostV1DepconfCommitCreateReqDto;
class PostV1DepconfCommitCreateResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostV1DepconfCommitCreateResDto = PostV1DepconfCommitCreateResDto;
//# sourceMappingURL=post-v1-depconf-commit-create.dto.js.map
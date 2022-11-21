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
exports.PostV1DepconfConfigUpdateInstanceResDto = exports.PostV1DepconfConfigUpdateInstanceReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostV1DepconfConfigUpdateInstanceReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'project': { required: true, type: () => String, description: "project" }, 'env': { required: true, type: () => String, description: "env" }, 'cid': { required: true, type: () => String, description: "cid" }, 'idc': { required: false, type: () => String, description: "idc" }, 'count': { required: true, type: () => String, description: "count" }, 'comment': { required: false, type: () => String, description: "comment" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "idc", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateInstanceReqDto.prototype, "comment", void 0);
exports.PostV1DepconfConfigUpdateInstanceReqDto = PostV1DepconfConfigUpdateInstanceReqDto;
class PostV1DepconfConfigUpdateInstanceResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostV1DepconfConfigUpdateInstanceResDto = PostV1DepconfConfigUpdateInstanceResDto;
//# sourceMappingURL=post-v1-depconf-config-update_instance.dto.js.map
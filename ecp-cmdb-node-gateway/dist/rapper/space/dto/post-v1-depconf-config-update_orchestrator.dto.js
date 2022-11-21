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
exports.PostV1DepconfConfigUpdateOrchestratorResDto = exports.PostV1DepconfConfigUpdateOrchestratorReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostV1DepconfConfigUpdateOrchestratorReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cid': { required: false, type: () => String }, 'email': { required: false, type: () => String }, 'env': { required: false, type: () => String }, 'idcs': { required: false, type: () => [Object] }, 'orchestrator': { required: false, type: () => String }, 'project': { required: false, type: () => String }, 'service_id': { required: false, type: () => Number }, 'service_meta_type': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "cid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "env", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "idcs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "orchestrator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "project", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostV1DepconfConfigUpdateOrchestratorReqDto.prototype, "service_meta_type", void 0);
exports.PostV1DepconfConfigUpdateOrchestratorReqDto = PostV1DepconfConfigUpdateOrchestratorReqDto;
class PostV1DepconfConfigUpdateOrchestratorResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostV1DepconfConfigUpdateOrchestratorResDto = PostV1DepconfConfigUpdateOrchestratorResDto;
//# sourceMappingURL=post-v1-depconf-config-update_orchestrator.dto.js.map
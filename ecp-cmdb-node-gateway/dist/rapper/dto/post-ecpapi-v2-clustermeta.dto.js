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
exports.PostEcpapiV2ClustermetaResDto = exports.PostEcpapiV2ClustermetaReqDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PostEcpapiV2ClustermetaReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'uuid': { required: false, type: () => String }, 'clusterKey': { required: false, type: () => String }, 'displayName': { required: false, type: () => String }, 'kubeConfig': { required: false, type: () => String }, 'azV1': { required: false, type: () => String }, 'azV2': { required: false, type: () => String }, 'monitoringUrl': { required: false, type: () => String }, 'kubeApiserverType': { required: false, type: () => String }, 'ecpVersion': { required: false, type: () => String }, 'handleByGalio': { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "uuid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "clusterKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "kubeConfig", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "azV1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "azV2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "monitoringUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "kubeApiserverType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2ClustermetaReqDto.prototype, "ecpVersion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PostEcpapiV2ClustermetaReqDto.prototype, "handleByGalio", void 0);
exports.PostEcpapiV2ClustermetaReqDto = PostEcpapiV2ClustermetaReqDto;
class PostEcpapiV2ClustermetaResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PostEcpapiV2ClustermetaResDto = PostEcpapiV2ClustermetaResDto;
//# sourceMappingURL=post-ecpapi-v2-clustermeta.dto.js.map
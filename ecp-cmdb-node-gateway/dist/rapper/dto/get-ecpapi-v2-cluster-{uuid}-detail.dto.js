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
exports.GetEcpapiV2Cluster1UuidDetailResDto = exports.GetEcpapiV2Cluster1UuidDetailReqDto = exports.Item99384 = exports.Item99385 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item99385 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'azV1': { required: false, type: () => String }, 'azV2': { required: false, type: () => String }, 'clusterKey': { required: false, type: () => String }, 'displayName': { required: false, type: () => String }, 'ecpVersion': { required: false, type: () => String }, 'handleByGalio': { required: false, type: () => Boolean }, 'kubeApiserverType': { required: false, type: () => String }, 'kubeConfig': { required: false, type: () => String }, 'monitoringUrl': { required: false, type: () => String }, 'region': { required: false, type: () => String }, 'segment': { required: false, type: () => String }, 'uuid': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "azV1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "azV2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "clusterKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "ecpVersion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item99385.prototype, "handleByGalio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "kubeApiserverType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "kubeConfig", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "monitoringUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "segment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99385.prototype, "uuid", void 0);
exports.Item99385 = Item99385;
class Item99384 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'meta': { required: false, type: () => require("./get-ecpapi-v2-cluster-{uuid}-detail.dto").Item99385 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99385),
    __metadata("design:type", Item99385)
], Item99384.prototype, "meta", void 0);
exports.Item99384 = Item99384;
class GetEcpapiV2Cluster1UuidDetailReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'uuid': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Cluster1UuidDetailReqDto.prototype, "uuid", void 0);
exports.GetEcpapiV2Cluster1UuidDetailReqDto = GetEcpapiV2Cluster1UuidDetailReqDto;
class GetEcpapiV2Cluster1UuidDetailResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'detail': { required: false, type: () => require("./get-ecpapi-v2-cluster-{uuid}-detail.dto").Item99384 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99384),
    __metadata("design:type", Item99384)
], GetEcpapiV2Cluster1UuidDetailResDto.prototype, "detail", void 0);
exports.GetEcpapiV2Cluster1UuidDetailResDto = GetEcpapiV2Cluster1UuidDetailResDto;
//# sourceMappingURL=get-ecpapi-v2-cluster-%7Buuid%7D-detail.dto.js.map
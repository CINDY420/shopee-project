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
exports.PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto = exports.PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto = exports.Item99622 = exports.Item99624 = exports.Item107360 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Item107360 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'namespace': { required: true, type: () => String }, 'podName': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item107360.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item107360.prototype, "podName", void 0);
exports.Item107360 = Item107360;
class Item99624 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'applied': { required: true, type: () => Number }, 'used': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99624.prototype, "applied", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99624.prototype, "used", void 0);
exports.Item99624 = Item99624;
class Item99622 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: true, type: () => require("./post-ecpapi-v2-svcdeploys-{deployId}-pods:metrics.dto").Item99624 }, 'memory': { required: true, type: () => require("./post-ecpapi-v2-svcdeploys-{deployId}-pods:metrics.dto").Item99624 }, 'namespace': { required: true, type: () => String }, 'podName': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99624),
    __metadata("design:type", Item99624)
], Item99622.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99624),
    __metadata("design:type", Item99624)
], Item99622.prototype, "memory", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99622.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99622.prototype, "podName", void 0);
exports.Item99622 = Item99622;
class PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'deployId': { required: true, type: () => String }, 'metrics': { required: true, type: () => String }, 'pods': { required: true, type: () => [require("./post-ecpapi-v2-svcdeploys-{deployId}-pods:metrics.dto").Item107360] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto.prototype, "metrics", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item107360),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto.prototype, "pods", void 0);
exports.PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto = PostEcpapiV2Svcdeploys$DeployIdPodsMetricsReqDto;
class PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./post-ecpapi-v2-svcdeploys-{deployId}-pods:metrics.dto").Item99622] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99622),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto.prototype, "items", void 0);
exports.PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto = PostEcpapiV2Svcdeploys$DeployIdPodsMetricsResDto;
//# sourceMappingURL=post-ecpapi-v2-svcdeploys-%7BdeployId%7D-pods:metrics.dto.js.map
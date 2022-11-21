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
exports.GetEcpapiV2Clusters1ClusterNameNodesResDto = exports.GetEcpapiV2Clusters1ClusterNameNodesReqDto = exports.Item99409 = exports.Item99411 = exports.Item99414 = exports.Item99420 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item99420 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'applied': { required: false, type: () => Number }, 'used': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99420.prototype, "applied", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99420.prototype, "used", void 0);
exports.Item99420 = Item99420;
class Item99414 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'effect': { required: false, type: () => String }, 'key': { required: false, type: () => String }, 'val': { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99414.prototype, "effect", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99414.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99414.prototype, "val", void 0);
exports.Item99414 = Item99414;
class Item99411 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cpu': { required: false, type: () => require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99420 }, 'mem': { required: false, type: () => require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99420 }, 'pods': { required: false, type: () => require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99420 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99420),
    __metadata("design:type", Item99420)
], Item99411.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99420),
    __metadata("design:type", Item99420)
], Item99411.prototype, "mem", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99420),
    __metadata("design:type", Item99420)
], Item99411.prototype, "pods", void 0);
exports.Item99411 = Item99411;
class Item99409 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'cluster': { required: false, type: () => String }, 'extraStatus': { required: false, type: () => [Object] }, 'ip': { required: false, type: () => String }, 'labels': { required: false, type: () => require("./index").ItemEmpty }, 'metrics': { required: false, type: () => require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99411 }, 'nodeName': { required: false, type: () => String }, 'roles': { required: false, type: () => [Object] }, 'status': { required: false, type: () => String }, 'taints': { required: false, type: () => [require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99414] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99409.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99409.prototype, "extraStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99409.prototype, "ip", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item99409.prototype, "labels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99411),
    __metadata("design:type", Item99411)
], Item99409.prototype, "metrics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99409.prototype, "nodeName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99409.prototype, "roles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99409.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99414),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99409.prototype, "taints", void 0);
exports.Item99409 = Item99409;
class GetEcpapiV2Clusters1ClusterNameNodesReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'clusterName': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Clusters1ClusterNameNodesReqDto.prototype, "clusterName", void 0);
exports.GetEcpapiV2Clusters1ClusterNameNodesReqDto = GetEcpapiV2Clusters1ClusterNameNodesReqDto;
class GetEcpapiV2Clusters1ClusterNameNodesResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: false, type: () => [require("./get-ecpapi-v2-clusters-{clusterName}-nodes.dto").Item99409] }, 'total': { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99409),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Clusters1ClusterNameNodesResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetEcpapiV2Clusters1ClusterNameNodesResDto.prototype, "total", void 0);
exports.GetEcpapiV2Clusters1ClusterNameNodesResDto = GetEcpapiV2Clusters1ClusterNameNodesResDto;
//# sourceMappingURL=get-ecpapi-v2-clusters-%7BclusterName%7D-nodes.dto.js.map
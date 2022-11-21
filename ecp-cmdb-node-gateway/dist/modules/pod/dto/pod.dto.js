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
exports.KillPodBody = exports.KillPodParam = exports.ListDeploymentPodResponse = exports.PodList = exports.ListDeploymentPodQuery = exports.ListDeploymentPodParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const list_query_dto_1 = require("../../../helpers/models/list-query.dto");
class ListDeploymentPodParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String }, deployId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListDeploymentPodParam.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListDeploymentPodParam.prototype, "deployId", void 0);
exports.ListDeploymentPodParam = ListDeploymentPodParam;
class ListDeploymentPodQuery extends list_query_dto_1.ListQuery {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ListDeploymentPodQuery = ListDeploymentPodQuery;
class PodList {
    static _OPENAPI_METADATA_FACTORY() {
        return { podName: { required: true, type: () => String }, nodeName: { required: true, type: () => String }, clusterName: { required: true, type: () => String }, namespace: { required: true, type: () => String }, sdu: { required: true, type: () => String }, cid: { required: true, type: () => String }, env: { required: true, type: () => String }, nodeIp: { required: true, type: () => String }, podIp: { required: true, type: () => String }, status: { required: true, type: () => String }, createdTime: { required: true, type: () => Number }, phase: { required: true, type: () => String }, tag: { required: true, type: () => String }, restartCount: { required: true, type: () => Number }, lastRestartTime: { required: true, type: () => Number }, cpu: { required: true, type: () => ({ applied: { required: true, type: () => Number }, used: { required: true, type: () => Number } }) }, memory: { required: true, type: () => ({ applied: { required: true, type: () => Number }, used: { required: true, type: () => Number } }) } };
    }
}
exports.PodList = PodList;
class ListDeploymentPodResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./pod.dto").PodList] }, statusList: { required: true, type: () => [String] }, total: { required: true, type: () => Number } };
    }
}
exports.ListDeploymentPodResponse = ListDeploymentPodResponse;
class KillPodParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String }, deployId: { required: true, type: () => String }, podName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KillPodParam.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KillPodParam.prototype, "deployId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KillPodParam.prototype, "podName", void 0);
exports.KillPodParam = KillPodParam;
class KillPodBody {
    static _OPENAPI_METADATA_FACTORY() {
        return { clusterName: { required: true, type: () => String }, namespace: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KillPodBody.prototype, "clusterName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KillPodBody.prototype, "namespace", void 0);
exports.KillPodBody = KillPodBody;
//# sourceMappingURL=pod.dto.js.map
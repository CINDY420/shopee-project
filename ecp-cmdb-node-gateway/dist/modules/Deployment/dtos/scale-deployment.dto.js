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
exports.ScaleDeploymentBody = exports.ScaleDeploymentParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ScaleDeploymentParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String }, deployId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScaleDeploymentParam.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScaleDeploymentParam.prototype, "deployId", void 0);
exports.ScaleDeploymentParam = ScaleDeploymentParam;
class ScaleDeploymentBody {
    static _OPENAPI_METADATA_FACTORY() {
        return { releaseReplicas: { required: true, type: () => Number }, canaryReplicas: { required: false, type: () => Number }, canaryValid: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ScaleDeploymentBody.prototype, "releaseReplicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ScaleDeploymentBody.prototype, "canaryReplicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ScaleDeploymentBody.prototype, "canaryValid", void 0);
exports.ScaleDeploymentBody = ScaleDeploymentBody;
//# sourceMappingURL=scale-deployment.dto.js.map
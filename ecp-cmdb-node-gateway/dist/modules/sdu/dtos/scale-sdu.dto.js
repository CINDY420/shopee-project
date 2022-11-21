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
exports.ScaleSDUBody = exports.DeploymentInstances = exports.DeployMeta = exports.DeployInstances = exports.ScaleSDUParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ScaleSDUParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScaleSDUParam.prototype, "sduName", void 0);
exports.ScaleSDUParam = ScaleSDUParam;
class DeployInstances {
    static _OPENAPI_METADATA_FACTORY() {
        return { releaseReplicas: { required: true, type: () => Number }, canaryReplicas: { required: false, type: () => Number }, canaryValid: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeployInstances.prototype, "releaseReplicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeployInstances.prototype, "canaryReplicas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DeployInstances.prototype, "canaryValid", void 0);
exports.DeployInstances = DeployInstances;
class DeployMeta {
    static _OPENAPI_METADATA_FACTORY() {
        return { az: { required: true, type: () => String }, componentType: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeployMeta.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeployMeta.prototype, "componentType", void 0);
exports.DeployMeta = DeployMeta;
class DeploymentInstances {
    static _OPENAPI_METADATA_FACTORY() {
        return { instances: { required: true, type: () => require("./scale-sdu.dto").DeployInstances }, meta: { required: true, type: () => require("./scale-sdu.dto").DeployMeta } };
    }
}
exports.DeploymentInstances = DeploymentInstances;
class ScaleSDUBody {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ScaleSDUBody.prototype, "deployments", void 0);
exports.ScaleSDUBody = ScaleSDUBody;
//# sourceMappingURL=scale-sdu.dto.js.map
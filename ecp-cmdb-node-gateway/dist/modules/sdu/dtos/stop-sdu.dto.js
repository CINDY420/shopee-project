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
exports.StopSDUBody = exports.StopSDUParam = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StopSDUParam {
    static _OPENAPI_METADATA_FACTORY() {
        return { sduName: { required: true, type: () => String }, deployId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StopSDUParam.prototype, "sduName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StopSDUParam.prototype, "deployId", void 0);
exports.StopSDUParam = StopSDUParam;
class StopSDUBody {
    static _OPENAPI_METADATA_FACTORY() {
        return { deployIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], StopSDUBody.prototype, "deployIds", void 0);
exports.StopSDUBody = StopSDUBody;
//# sourceMappingURL=stop-sdu.dto.js.map
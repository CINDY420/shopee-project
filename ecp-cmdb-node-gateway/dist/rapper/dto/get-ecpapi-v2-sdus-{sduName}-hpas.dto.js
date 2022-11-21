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
exports.GetEcpapiV2Sdus1SduNameHpasResDto = exports.GetEcpapiV2Sdus1SduNameHpasReqDto = exports.Item99533 = exports.Item99535 = exports.Item99537 = exports.Item99541 = exports.Item99543 = exports.Item99549 = exports.Item99551 = exports.Item99552 = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const _1 = require(".");
class Item99552 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'notifyFailed': { required: true, type: () => Boolean }, 'selected': { required: true, type: () => Boolean }, 'stabilizationWindowSeconds': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item99552.prototype, "notifyFailed", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Item99552.prototype, "selected", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99552.prototype, "stabilizationWindowSeconds", void 0);
exports.Item99552 = Item99552;
class Item99551 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'metrics': { required: true, type: () => String }, 'threshold': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99551.prototype, "metrics", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99551.prototype, "threshold", void 0);
exports.Item99551 = Item99551;
class Item99549 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'endTime': { required: true, type: () => String }, 'endWeekday': { required: true, type: () => require("./index").ItemEmpty }, 'repeatType': { required: true, type: () => require("./index").ItemEmpty }, 'startTime': { required: true, type: () => String }, 'startWeekday': { required: true, type: () => require("./index").ItemEmpty }, 'targetCount': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99549.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item99549.prototype, "endWeekday", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item99549.prototype, "repeatType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99549.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => _1.ItemEmpty),
    __metadata("design:type", _1.ItemEmpty)
], Item99549.prototype, "startWeekday", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99549.prototype, "targetCount", void 0);
exports.Item99549 = Item99549;
class Item99543 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'autoscalingRule': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99551 }, 'cronRule': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99549 }, 'type': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99551),
    __metadata("design:type", Item99551)
], Item99543.prototype, "autoscalingRule", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99549),
    __metadata("design:type", Item99549)
], Item99543.prototype, "cronRule", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99543.prototype, "type", void 0);
exports.Item99543 = Item99543;
class Item99541 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'scaleDown': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99552 }, 'scaleUp': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99552 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99552),
    __metadata("design:type", Item99552)
], Item99541.prototype, "scaleDown", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99552),
    __metadata("design:type", Item99552)
], Item99541.prototype, "scaleUp", void 0);
exports.Item99541 = Item99541;
class Item99537 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'autoscalingLogic': { required: true, type: () => String }, 'behavior': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99541 }, 'maxReplicaCount': { required: true, type: () => Number }, 'minReplicaCount': { required: true, type: () => Number }, 'notifyChannel': { required: true, type: () => String }, 'status': { required: true, type: () => Number }, 'triggerRules': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99543] }, 'updatedTime': { required: true, type: () => String }, 'updator': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99537.prototype, "autoscalingLogic", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99541),
    __metadata("design:type", Item99541)
], Item99537.prototype, "behavior", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99537.prototype, "maxReplicaCount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99537.prototype, "minReplicaCount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99537.prototype, "notifyChannel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99537.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99543),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Item99537.prototype, "triggerRules", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99537.prototype, "updatedTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99537.prototype, "updator", void 0);
exports.Item99537 = Item99537;
class Item99535 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'az': { required: true, type: () => String }, 'sdu': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99535.prototype, "az", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Item99535.prototype, "sdu", void 0);
exports.Item99535 = Item99535;
class Item99533 {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'id': { required: true, type: () => Number }, 'meta': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99535 }, 'spec': { required: true, type: () => require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99537 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Item99533.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99535),
    __metadata("design:type", Item99535)
], Item99533.prototype, "meta", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99537),
    __metadata("design:type", Item99537)
], Item99533.prototype, "spec", void 0);
exports.Item99533 = Item99533;
class GetEcpapiV2Sdus1SduNameHpasReqDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'sduName': { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEcpapiV2Sdus1SduNameHpasReqDto.prototype, "sduName", void 0);
exports.GetEcpapiV2Sdus1SduNameHpasReqDto = GetEcpapiV2Sdus1SduNameHpasReqDto;
class GetEcpapiV2Sdus1SduNameHpasResDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { 'items': { required: true, type: () => [require("./get-ecpapi-v2-sdus-{sduName}-hpas.dto").Item99533] }, 'total': { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Item99533),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetEcpapiV2Sdus1SduNameHpasResDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetEcpapiV2Sdus1SduNameHpasResDto.prototype, "total", void 0);
exports.GetEcpapiV2Sdus1SduNameHpasResDto = GetEcpapiV2Sdus1SduNameHpasResDto;
//# sourceMappingURL=get-ecpapi-v2-sdus-%7BsduName%7D-hpas.dto.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodModule = void 0;
const fetch_module_1 = require("../fetch/fetch.module");
const pod_controller_1 = require("./pod.controller");
const pod_service_1 = require("./pod.service");
const common_1 = require("@nestjs/common");
let PodModule = class PodModule {
};
PodModule = __decorate([
    (0, common_1.Module)({
        controllers: [pod_controller_1.PodController],
        imports: [fetch_module_1.FetchModule],
        providers: [pod_service_1.PodService],
        exports: [pod_service_1.PodService],
    })
], PodModule);
exports.PodModule = PodModule;
//# sourceMappingURL=pod.module.js.map
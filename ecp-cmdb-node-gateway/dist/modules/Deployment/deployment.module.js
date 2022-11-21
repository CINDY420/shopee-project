"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentModule = void 0;
const fetch_module_1 = require("../fetch/fetch.module");
const deployment_controller_1 = require("./deployment.controller");
const deployment_service_1 = require("./deployment.service");
const common_1 = require("@nestjs/common");
let DeploymentModule = class DeploymentModule {
};
DeploymentModule = __decorate([
    (0, common_1.Module)({
        controllers: [deployment_controller_1.DeploymentController],
        imports: [fetch_module_1.FetchModule],
        providers: [deployment_service_1.DeploymentService],
        exports: [deployment_service_1.DeploymentService],
    })
], DeploymentModule);
exports.DeploymentModule = DeploymentModule;
//# sourceMappingURL=deployment.module.js.map
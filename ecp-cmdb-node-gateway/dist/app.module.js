"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const sdu_module_1 = require("./modules/sdu/sdu.module");
const space_auth_1 = require("@infra-node-kit/space-auth");
const generate_space_env_1 = require("./helpers/utils/generate-space-env");
const http_1 = require("@infra-node-kit/http");
const fetch_module_1 = require("./modules/fetch/fetch.module");
const deployment_module_1 = require("./modules/deployment/deployment.module");
const pod_module_1 = require("./modules/pod/pod.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            http_1.HttpModule,
            fetch_module_1.FetchModule,
            space_auth_1.SpaceAuthModule.forRoot({
                environment: (0, generate_space_env_1.generateSpaceEnv)(),
            }),
            sdu_module_1.SduModule,
            deployment_module_1.DeploymentModule,
            pod_module_1.PodModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
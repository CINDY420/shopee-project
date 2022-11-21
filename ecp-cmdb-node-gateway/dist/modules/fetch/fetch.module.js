"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchModule = void 0;
const fetch_controller_1 = require("./fetch.controller");
const fetch_service_1 = require("./fetch.service");
const http_1 = require("@infra-node-kit/http");
const space_auth_1 = require("@infra-node-kit/space-auth");
const common_1 = require("@nestjs/common");
let FetchModule = class FetchModule {
};
FetchModule = __decorate([
    (0, common_1.Module)({
        controllers: [fetch_controller_1.FetchController],
        imports: [http_1.HttpModule],
        providers: [fetch_service_1.FetchService, space_auth_1.SpaceAuthService],
        exports: [fetch_service_1.FetchService],
    })
], FetchModule);
exports.FetchModule = FetchModule;
//# sourceMappingURL=fetch.module.js.map
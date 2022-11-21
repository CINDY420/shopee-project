"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SduModule = void 0;
const fetch_module_1 = require("../fetch/fetch.module");
const sdu_controller_1 = require("./sdu.controller");
const sdu_service_1 = require("./sdu.service");
const common_1 = require("@nestjs/common");
let SduModule = class SduModule {
};
SduModule = __decorate([
    (0, common_1.Module)({
        controllers: [sdu_controller_1.SduController],
        imports: [fetch_module_1.FetchModule],
        providers: [sdu_service_1.SduService],
        exports: [sdu_service_1.SduService],
    })
], SduModule);
exports.SduModule = SduModule;
//# sourceMappingURL=sdu.module.js.map
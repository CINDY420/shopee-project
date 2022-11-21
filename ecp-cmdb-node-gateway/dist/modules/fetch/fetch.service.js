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
exports.FetchService = void 0;
const common_1 = require("@nestjs/common");
const space_auth_1 = require("@infra-node-kit/space-auth");
const http_1 = require("@infra-node-kit/http");
const override_ecp_cmdb_fetch_1 = require("../../helpers/fetch/override-ecp-cmdb-fetch");
const config_1 = require("@nestjs/config");
const override_space_fetch_1 = require("../../helpers/fetch/override-space-fetch");
let FetchService = class FetchService {
    constructor(spaceAuthService, httpService, configService) {
        var _a, _b;
        this.spaceAuthService = spaceAuthService;
        this.httpService = httpService;
        this.configService = configService;
        const cmdbBaseURL = (_a = this.configService.get('cmdbBaseUrl')) !== null && _a !== void 0 ? _a : '';
        const spaceBaseUrl = (_b = this.configService.get('spaceBaseUrl')) !== null && _b !== void 0 ? _b : '';
        this.cmdbFetch = (0, override_ecp_cmdb_fetch_1.overRideCmdbFetch)(this.httpService.axiosRef, { baseURL: cmdbBaseURL }, this.spaceAuthService);
        this.spaceFetch = (0, override_space_fetch_1.overRideSpaceFetch)(this.httpService.axiosRef, { baseURL: spaceBaseUrl }, this.spaceAuthService);
    }
};
FetchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [space_auth_1.SpaceAuthService,
        http_1.HttpService,
        config_1.ConfigService])
], FetchService);
exports.FetchService = FetchService;
//# sourceMappingURL=fetch.service.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFetch = exports.createFetch = exports.fetch = exports.overrideFetch = void 0;
const request_1 = require("./request");
Object.defineProperty(exports, "createFetch", { enumerable: true, get: function () { return request_1.createFetch; } });
const commonLib = __importStar(require("@infra/rapper/runtime/commonLib"));
const { defaultFetch } = commonLib;
exports.defaultFetch = defaultFetch;
let fetch = (0, request_1.createFetch)({}, { fetchType: commonLib.FetchType.BASE });
exports.fetch = fetch;
const overrideFetch = (fetchConfig) => {
    exports.fetch = fetch = (0, request_1.createFetch)(fetchConfig, { fetchType: commonLib.FetchType.AUTO });
};
exports.overrideFetch = overrideFetch;
//# sourceMappingURL=index.js.map
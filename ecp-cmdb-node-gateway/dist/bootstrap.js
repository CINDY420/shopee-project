"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.listenError = exports.bootstrapPrometheusApp = exports.bootstrapMainApp = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const validation_pipe_exception_factory_1 = require("./helpers/utils/validation-pipe-exception-factory");
const core_2 = require("@infra-node-kit/core");
const infra_config_1 = require("./infra.config");
const prometheus_1 = require("@infra-node-kit/prometheus");
const logger_1 = require("@infra-node-kit/logger");
const swagger_1 = require("@nestjs/swagger");
const loggerService = (0, logger_1.createLoggerService)();
const logger = (0, logger_1.createLogger)();
async function bootstrapMainApp() {
    var _a;
    const app = await (0, core_2.applyConfig)(infra_config_1.InfraConfig).createApp(app_module_1.AppModule, {
        logger: loggerService,
    });
    app.setGlobalPrefix('api/ecp-cmdb');
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        enableDebugMessages: true,
        forbidUnknownValues: false,
        stopAtFirstError: true,
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: validation_pipe_exception_factory_1.exceptionFactory,
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('ECP CMDB bff document')
        .setDescription('ECP CMDB API description')
        .setVersion('1.0')
        .build();
    const config = {
        operationIdFactory: (controllerKey, methodKey) => `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`,
    };
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, options, config);
    swagger_1.SwaggerModule.setup('api/ecp-cmdb', app, swaggerDocument);
    const configService = app.get(config_1.ConfigService);
    const port = (_a = configService.get('port')) !== null && _a !== void 0 ? _a : 3000;
    await app.listen(port);
    logger.info(`Application is running on: ${await app.getUrl()}, NODE_ENV=${process.env.NODE_ENV}`);
    return app;
}
exports.bootstrapMainApp = bootstrapMainApp;
async function bootstrapPrometheusApp() {
    const app = await core_1.NestFactory.create(prometheus_1.PrometheusModule.config({}));
    await app.listen(2020);
}
exports.bootstrapPrometheusApp = bootstrapPrometheusApp;
function listenError() {
    process.on('unhandledRejection', (err) => {
        logger.error(`unhandledRejection: ${err.stack}`);
    });
    process.on('uncaughtException', (err) => {
        logger.error(`uncaughtException: ${err.stack}`);
    });
}
exports.listenError = listenError;
async function startServer() {
    listenError();
    await bootstrapMainApp();
    await bootstrapPrometheusApp();
    logger.info('Application start is complete');
}
exports.startServer = startServer;
//# sourceMappingURL=bootstrap.js.map
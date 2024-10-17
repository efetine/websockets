"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enviroments_config_1 = require("./src/config/enviroments.config");
var drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './db/schema.ts',
    out: './db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: enviroments_config_1.POSTGRES_URL,
    },
});

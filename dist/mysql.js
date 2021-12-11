"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const colors_1 = require("./colors");
const helpers_1 = require("./helpers");
const state_1 = require("./state");
const createConnection = async () => {
    try {
        const { host, user, password, database, port } = (0, state_1.getState)();
        const options = {
            host,
            user,
            password,
            database,
            port,
        };
        return await promise_1.default.createConnection(options);
    }
    catch (e) {
        helpers_1.output.print(e.message, colors_1.Colors.FgRed);
        process.exit(1);
    }
};
exports.createConnection = createConnection;
exports.default = promise_1.default;

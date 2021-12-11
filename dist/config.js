"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.getConfig = void 0;
const yaml_1 = __importDefault(require("yaml"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const configPath = path_1.default.join(os_1.default.homedir(), `/.config/mysqlsearch/config.yaml`);
let data = {};
if (fs_1.default.existsSync(configPath)) {
    const read = fs_1.default.readFileSync(configPath, 'utf-8');
    data = yaml_1.default.parse(read);
    if (!data) {
        data = {};
    }
}
const getConfig = (option, defaultValue) => {
    if (typeof option === 'undefined') {
        return data;
    }
    if (typeof data[option] !== 'undefined') {
        return data[option];
    }
    return defaultValue;
};
exports.getConfig = getConfig;
const setConfig = (key, value) => {
    data[key] = value;
    const str = yaml_1.default.stringify(data);
    fs_1.default.writeFileSync(configPath, str);
};
exports.setConfig = setConfig;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = exports.regex = exports.escapeRegex = void 0;
const util_1 = __importDefault(require("util"));
const colors_1 = require("./colors");
const escapeRegex = (string) => {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};
exports.escapeRegex = escapeRegex;
const regex = (search, left = '', right = '') => {
    return new RegExp(`${left}${(0, exports.escapeRegex)(search)}${right}`, 'gmi');
};
exports.regex = regex;
exports.output = {
    print(str, color) {
        this.write(str + '\n', color);
    },
    write(str, color) {
        str = String(str);
        str = color ? (0, colors_1.colorize)(str, color) : str;
        process.stdout.write(str);
    },
    debug(str, depth = 10) {
        this.print(util_1.default.inspect(str, false, depth, true));
    },
};

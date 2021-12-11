"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirected = void 0;
const tty_1 = __importDefault(require("tty"));
exports.redirected = !tty_1.default.isatty(process.stdout.fd);
